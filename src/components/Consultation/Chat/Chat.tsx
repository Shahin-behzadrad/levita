import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/Shared/Button";
import Text from "@/components/Shared/Text";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./Chat.module.scss";
import { format } from "date-fns";
import { useApp } from "@/lib/AppContext";
import { ArrowLeft } from "lucide-react";
import TextField from "@/components/Shared/TextField";

interface ChatProps {
  consultationId: Id<"consultations">;
  isDoctor: boolean;
}

export const Chat = ({ consultationId, isDoctor }: ChatProps) => {
  const { messages } = useLanguage();
  const { setView, currentView } = useApp();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consultation = useQuery(
    api.api.consultation.getConsultationDetails.getConsultationDetails,
    {
      consultationId,
    }
  );
  const chatMessages = useQuery(
    api.api.consultation.getChatMessages.getChatMessages,
    {
      consultationId,
    }
  );
  const startChat = useMutation(api.api.consultation.startChat.startChat);
  const endChat = useMutation(api.api.consultation.endChat.endChat);
  const sendMessage = useMutation(api.api.consultation.sendMessage.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleStartChat = async () => {
    try {
      await startChat({ consultationId });
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const handleEndChat = async () => {
    try {
      await endChat({ consultationId });
    } catch (error) {
      console.error("Failed to end chat:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        consultationId,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!consultation) return null;

  const canStartChat =
    isDoctor && !consultation.chatStarted && !consultation.chatEnded;
  const isChatActive = consultation.chatStarted && !consultation.chatEnded;
  const canEndChat =
    isDoctor && consultation.chatStarted && !consultation.chatEnded;

  return (
    <div className={styles.chatContainer}>
      {currentView === "chat" && (
        <div className={styles.header}>
          <Button
            variant="text"
            startIcon={<ArrowLeft />}
            onClick={() => setView("home")}
          >
            Back
          </Button>
          <Text
            value={`Chat with ${isDoctor ? "Patient" : "Doctor"}`}
            fontSize="lg"
            fontWeight="medium"
          />
        </div>
      )}

      {canStartChat && (
        <Button variant="contained" onClick={handleStartChat}>
          Start Chat
        </Button>
      )}

      {isChatActive && (
        <div className={styles.chatBox}>
          <div className={styles.messages}>
            {chatMessages?.map((message) => (
              <div
                key={message._id}
                className={`${styles.message} ${
                  message.senderId === consultation.senderUserId
                    ? styles.patientMessage
                    : styles.doctorMessage
                }`}
              >
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>
                  {format(new Date(message.createdAt), "HH:mm")}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className={styles.messageInput}>
            <TextField
              maxLength={100}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!isChatActive}
            />
            <Button
              type="submit"
              variant="contained"
              className={styles.sendButton}
              disabled={!isChatActive}
            >
              Send
            </Button>
          </form>
        </div>
      )}

      {canEndChat && (
        <Button variant="outlined" onClick={handleEndChat}>
          End Chat
        </Button>
      )}

      {consultation.chatEnded && (
        <Text value="This chat has ended" color="gray" />
      )}
    </div>
  );
};
