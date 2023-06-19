import React, { useState } from "react";
import axios from "axios";
import { IMessage } from "../../models/message";
import { useSession } from "next-auth/react";

import styles from "./MessageForm.module.scss";
import Link from "next/link";
import Button from "../Button";
import InputFeild from "../InputFeild";

interface MessageFormProps {
  getAllMessages: () => Promise<void>;
  message: IMessage;
}

const MessageForm: React.FC<MessageFormProps> = ({
  getAllMessages,
  message,
}) => {
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMessage, setEditMessage] = useState<IMessage | null>(null);

  const { data: session } = useSession();

  const handleEditTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditTitle(event.target.value);
  };

  const handleEditContentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditContent(event.target.value);
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiRes = await axios.delete(
        `${process.env.NEXTAUTH_URL}/api/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiRes?.data?.success) {
        console.log("Message deleted:", messageId);

        await getAllMessages();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleEditMessage = (message: IMessage) => {
    setEditMessage(message);
    setEditTitle(message.title);
    setEditContent(message.content);
  };

  const handleUpdateMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiRes = await axios.post(
        `${process.env.NEXTAUTH_URL}/api/messages/${editMessage?._id}`,
        {
          title: editTitle,
          content: editContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiRes?.data?.success) {
        console.log("Message updated:", apiRes.data.message);
        setEditTitle("");
        setEditContent("");
        setEditMessage(null);
        await getAllMessages();
      } else {
        console.error("Error updating message:", apiRes?.data?.error);
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Link href={`/messages/${message._id}`} className={styles.link}>
        Open message
      </Link>
      {editMessage && editMessage._id === message._id ? (
        <div>
          <InputFeild
            type="text"
            value={editTitle}
            onChange={handleEditTitleChange}
            placeholder="Title"
          />
          <InputFeild
            type="text"
            value={editTitle}
            onChange={handleEditContentChange}
            placeholder="Title"
          />
          <Button
            onClick={handleUpdateMessage}
            title={"Update Message"}
            variant="outlined"
          />
        </div>
      ) : (
        <>
          <h3>{message.title}</h3>
          <p>{message.content}</p>
          <p>Author: {message.author}</p>
          <p>Comments: {message.comments.length}</p>
          {session?.user?.email === message.author && (
            <Button
              onClick={() => handleDeleteMessage(message._id)}
              title={"Удалить"}
              width="25%"
              variant="contained"
            />
          )}
          {session?.user?.email === message.author && (
            <Button
              onClick={() => handleEditMessage(message)}
              title={"Change"}
              width="25%"
              variant="outlined"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MessageForm;
