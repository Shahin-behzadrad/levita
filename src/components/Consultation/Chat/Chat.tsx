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
import { ArrowLeft, ExternalLinkIcon, Paperclip, X } from "lucide-react";
import TextField from "@/components/Shared/TextField";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
import { useAction } from "convex/react";

interface ChatProps {
  consultationId: Id<"consultations">;
  isDoctor: boolean;
}

export const Chat = ({ consultationId, isDoctor }: ChatProps) => {
  const isMobile = useIsMobile();
  const { messages } = useLanguage();
  const { setView, currentView } = useApp();
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const uploadFile = useAction(api.api.consultation.uploadFile.uploadFile);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        arrayBuffer: arrayBuffer,
      };

      const fileUrl = await uploadFile({
        consultationId: consultationId,
        fileData,
      });

      return fileUrl;
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      if (selectedFile) {
        const fileUrl = await handleFileUpload(selectedFile);
        await sendMessage({
          consultationId,
          content: newMessage.trim(),
          fileUrl,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        });
      } else {
        await sendMessage({
          consultationId,
          content: newMessage.trim(),
        });
      }
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!consultation) return null;

  const canStartChat =
    isDoctor && !consultation.chatStarted && !consultation.chatEnded;
  const isChatActive = consultation.chatStarted && !consultation.chatEnded;
  const canEndChat =
    isDoctor && consultation.chatStarted && !consultation.chatEnded;

  // Determine if a message is from the current user
  const isMessageFromCurrentUser = (message: any) => {
    if (isDoctor) {
      return message.senderId !== consultation.senderUserId;
    } else {
      return message.senderId === consultation.senderUserId;
    }
  };

  const renderMessageContent = (message: any) => {
    if (message.fileUrl) {
      const isImage = message.fileType?.startsWith("image/");
      const isPDF = message.fileType === "application/pdf";

      if (isImage) {
        return (
          <div className={styles.fileMessage}>
            <img
              src={message.fileUrl}
              alt={message.fileName}
              className={styles.filePreview}
            />
            <Text value={message.fileName} fontSize="sm" color="gray" />
          </div>
        );
      }

      if (isPDF) {
        return (
          <div className={styles.fileMessage}>
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fileLink}
            >
              <Text value={`📄 ${message.fileName}`} fontSize="sm" />
            </a>
          </div>
        );
      }

      return (
        <div className={styles.fileMessage}>
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fileLink}
          >
            <Text value={`📎 ${message.fileName}`} fontSize="sm" />
          </a>
        </div>
      );
    }

    return <div className={styles.messageContent}>{message.content}</div>;
  };

  return (
    <div className={styles.chatContainer}>
      {currentView === "chat" && (
        <div className={styles.header}>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => setView("home")}
          >
            Back
          </Button>
          <Text
            value={`Chat with ${isDoctor ? "Patient" : "Doctor"}`}
            fontWeight="medium"
          />

          <Button
            className={clsx(styles.endChatButton, {
              [styles.hideButton]: !canEndChat,
            })}
            variant="outlined"
            size="sm"
            onClick={handleEndChat}
          >
            End Chat
          </Button>
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
                  isMessageFromCurrentUser(message)
                    ? styles.currentUserMessage
                    : styles.otherUserMessage
                }`}
              >
                {renderMessageContent(message)}
                <div className={styles.messageTime}>
                  {format(new Date(message.createdAt), "HH:mm")}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className={styles.messageInput}>
            {selectedFile && (
              <div className={styles.selectedFile}>
                <Text value={selectedFile.name} fontSize="sm" />
                <Button
                  variant="text"
                  size="sm"
                  onClick={removeSelectedFile}
                  startIcon={<X size={16} />}
                />
              </div>
            )}
            <div className={styles.inputContainer}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                className={styles.fileInput}
              />
              <Button
                variant="outlined"
                className={styles.attachButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={18} />
              </Button>
              <TextField
                multiline
                maxLength={100}
                fullWidth
                type="text"
                className={styles.messageInputField}
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
            </div>
          </form>
        </div>
      )}

      {consultation.chatEnded && (
        <Text value="This chat has ended" color="gray" />
      )}
    </div>
  );
};
