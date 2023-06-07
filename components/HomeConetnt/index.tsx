import React, { useState, useEffect } from "react";
import { Container } from "./HomeElements";
import axios from "axios";
import { IMessage } from "../../models/message";
import { useSession } from "next-auth/react";

type Props = {};

const HomeContent = (props: Props) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMessage, setEditMessage] = useState<IMessage | null>(null);
  
  const [submitError, setSubmitError] = useState("");
  
  const { data: session } = useSession();
  console.log("dataNavbar", session);
  console.log("messages", messages);

  const getAllMessages = async () => {
    try {
      const apiRes = await axios.get("http://localhost:3000/api/messages/all");

      if (apiRes?.data?.success) {
        setMessages(apiRes.data.messages);
      }
    } catch (error) {
      console.error("Error retrieving messages:", error);
    }
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  
  const handleNewTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleNewContentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewContent(event.target.value);
  };

  const handleCreateMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiRes = await axios.post(
        "http://localhost:3000/api/messages/create",
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiRes?.data?.success) {
        console.log("Message created:", apiRes.data.message);
        setNewTitle("");
        setNewContent("");
        await getAllMessages();
      }
    } catch (error) {
      console.error("Error creating message:", error);
      setSubmitError("Error creating message");
    }
  };


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
        `http://localhost:3000/api/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiRes?.data?.success) {
        console.log("Message deleted:", messageId);
        // Обработка успешного удаления сообщения

        // Загрузка сообщений после удаления
        await getAllMessages();
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      // Обработка ошибки удаления сообщения
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
        `http://localhost:3000/api/messages/${editMessage?._id}`,
        {
          title: editTitle, // Используем текущее значение editTitle
          content: editContent, // Используем текущее значение editContent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiRes?.data?.success) {
        console.log("Message updated:", apiRes.data.message);
        // Обработка успешного обновления сообщения
        setEditTitle("");
        setEditContent("");
        setEditMessage(null);
        await getAllMessages();
      } else {
        console.error("Error updating message:", apiRes?.data?.error);
        // Обработка ошибки обновления сообщения
      }
    } catch (error) {
      console.error("Error updating message:", error);
      // Обработка ошибки обновления сообщения
    }
  };

  return (
    <Container>
      <div>
        <input
          type="text"
          value={newTitle}
          onChange={handleNewTitleChange}
          placeholder="Title"
        />
        <input
          type="text"
          value={newContent}
          onChange={handleNewContentChange}
          placeholder="Content"
        />
        <button onClick={handleCreateMessage}>Create Message</button>
        {submitError && <p>{submitError}</p>}
      </div>
      <br />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {messages.map((message) => (
          <div key={message._id} style={{ display: "flex", gap: "10px" }}>
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
                {/* {message.comments.map(comment => (<div>{comment[0]}</div>))} */}
              </>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomeContent;
