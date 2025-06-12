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
import {
  ArrowLeft,
  ExternalLinkIcon,
  Paperclip,
  X,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import TextField from "@/components/Shared/TextField";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
import { useAction } from "convex/react";
import Image from "@/components/Shared/Image/Image";

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
    setSelectedFile(null);
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

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const renderMessageContent = (message: any) => {
    if (message.fileUrl) {
      const isImage = message.fileType?.startsWith("image/");
      const isPDF = message.fileType === "application/pdf";
      const isDocument =
        message.fileType?.includes("document") ||
        message.fileType?.includes("word") ||
        message.fileType?.includes("text");

      if (isImage) {
        return (
          <div className={styles.fileMessage}>
            <div className={styles.filePreviewContainer}>
              <Image
                src={message.fileUrl}
                alt={message.fileName}
                className={styles.filePreview}
                onClick={() => window.open(message.fileUrl, "_blank")}
                width={100}
                height={100}
                shape="square"
              />
            </div>
            <div className={styles.fileInfo}>
              <Text value={message.fileName} fontSize="sm" color="gray" />
              <div className={styles.fileActions}>
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<ExternalLinkIcon size={16} />}
                  onClick={() => window.open(message.fileUrl, "_blank")}
                >
                  Open
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<Download size={16} />}
                  onClick={() =>
                    downloadFile(message.fileUrl, message.fileName)
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        );
      }

      if (isPDF || isDocument) {
        return (
          <div className={styles.fileMessage}>
            <div className={styles.documentPreview}>
              <div className={styles.documentIcon}>
                {isPDF ? <FileText size={32} /> : <FileText size={32} />}
              </div>
              <div className={styles.documentInfo}>
                <Text
                  value={message.fileName}
                  fontSize="sm"
                  fontWeight="medium"
                />
                <Text
                  value={isPDF ? "PDF Document" : "Document"}
                  fontSize="xs"
                  color="gray"
                />
              </div>
            </div>
            <div className={styles.fileActions}>
              <Button
                variant="outlined"
                size="sm"
                startIcon={<ExternalLinkIcon size={16} />}
                onClick={() => window.open(message.fileUrl, "_blank")}
              >
                Open
              </Button>
              <Button
                variant="outlined"
                size="sm"
                startIcon={<Download size={16} />}
                onClick={() => downloadFile(message.fileUrl, message.fileName)}
              >
                Download
              </Button>
            </div>
          </div>
        );
      }

      // For other file types
      return (
        <div className={styles.fileMessage}>
          <div className={styles.documentPreview}>
            <div className={styles.documentIcon}>
              <Paperclip size={32} />
            </div>
            <div className={styles.documentInfo}>
              <Text
                value={message.fileName}
                fontSize="sm"
                fontWeight="medium"
              />
              <Text value="File" fontSize="xs" color="gray" />
            </div>
          </div>
          <div className={styles.fileActions}>
            <Button
              variant="outlined"
              size="sm"
              startIcon={<ExternalLinkIcon size={16} />}
              onClick={() => window.open(message.fileUrl, "_blank")}
            >
              Open
            </Button>
            <Button
              variant="outlined"
              size="sm"
              startIcon={<Download size={16} />}
              onClick={() => downloadFile(message.fileUrl, message.fileName)}
            >
              Download
            </Button>
          </div>
        </div>
      );
    }

    return <Text value={message.content} />;
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
            <div className={styles.inputContainer}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                className={styles.fileInput}
              />
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
                endAdornmentClassName={styles.attachButtonContainer}
                endAdornment={
                  selectedFile ? (
                    <div className={styles.filePreview}>
                      <div className={styles.fileInfo}>
                        {selectedFile.type.startsWith("image/") ? (
                          <Image
                            src={URL.createObjectURL(selectedFile)}
                            alt={selectedFile.name}
                            width={24}
                            height={24}
                            shape="square"
                          />
                        ) : (
                          <div className={styles.fileIcon}>
                            <FileText size={80} />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        size="sm"
                        className={styles.removeFileButton}
                        onClick={removeSelectedFile}
                        startIcon={<X size={14} />}
                      />
                    </div>
                  ) : (
                    <Button
                      className={styles.attachButton}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip size={18} />
                    </Button>
                  )
                }
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
