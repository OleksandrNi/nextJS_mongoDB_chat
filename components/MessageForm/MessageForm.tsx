import React, { useState } from "react";
import axios from "axios";
import { IMessage } from "../../models/message";
import { useSession } from "next-auth/react";

import styles from "./MessageForm.module.scss";

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
  const [newComment, setNewComment] = useState("");
  
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


  const handleNewCommentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("messageInComments", message);
      const apiRes = await axios.patch(
        `${process.env.NEXTAUTH_URL}/api/messages/${message._id}`,
        {
          content: newComment,
          author: session?.user?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiRes?.data?.success) {
        console.log("Comment added:", apiRes.data.comment);

        setNewComment("");
        await getAllMessages();
      } else {
        console.error("Error adding comment:", apiRes?.data?.error);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className={styles.container}>
      {editMessage && editMessage._id === message._id ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={handleEditTitleChange}
            placeholder="Title"
          />
          <input
            type="text"
            value={editContent}
            onChange={handleEditContentChange}
            placeholder="Content"
          />
          <button onClick={handleUpdateMessage}>Update Message</button>
        </div>
      ) : (
        <>
          <h3>{message.title}</h3>
          <p>{message.content}</p>
          <p>Author: {message.author}</p>
          {session?.user?.email === message.author && (
            <button onClick={() => handleDeleteMessage(message._id)}>
              Удалить
            </button>
          )}
          {session?.user?.email === message.author && (
            <button onClick={() => handleEditMessage(message)}>
              Редактировать
            </button>
          )}
          <div>
            <input
              type="text"
              value={newComment}
              onChange={handleNewCommentChange}
              placeholder="New Comment"
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
          {message.comments.map((comment) => (
            <div key={comment._id}>{comment.content} {comment.author}</div>
          ))}
        </>
      )}
    </div>
  );
};

export default MessageForm;
