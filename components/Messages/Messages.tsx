import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "./Messages.module.scss";
import { IMessage } from "../../models/message";
import CreateMessage from "../CreateMessage/CreateMessage";
import MessageForm from "../MessageForm/MessageForm";

interface CreateMessageProps {}

const Messages: React.FC<CreateMessageProps> = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const getAllMessages = async () => {
    try {
      const apiRes = await axios.get(
        `${process.env.NEXTAUTH_URL}/api/messages/all`
      );

      if (apiRes?.data?.success) {
        setMessages(apiRes.data.messages);
      }
    } catch (error) {
      console.error("Error retrieving messages:", error);
    }
  };

  useEffect(() => {
    getAllMessages();
    const interval = setInterval(getAllMessages, 5000); // Отправлять запрос каждые 5 секунд
    return () => clearInterval(interval); // Очистить интервал при размонтировании компонента
  }, []);

  return (
    <div className={styles.container}>
      <CreateMessage getAllMessages={getAllMessages} />
      <div className={styles.messages}>
        {messages.map((message) => (
          <MessageForm
            key={message._id}
            message={message}
            getAllMessages={getAllMessages}
          />
        ))}
      </div>
    </div>
  );
};

export default Messages;
