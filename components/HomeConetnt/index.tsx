import React, { useState, useEffect } from "react";
import { Container } from "./HomeElements";
import axios from "axios";
import { IMessage } from "../../models/message";
import MessageForm from "../MessageForm/MessageForm";
import CreateMessage from "../CreateMessage/CreateMessage";

type Props = {};

const HomeContent = (props: Props) => {
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
  }, []);

  return (
    <Container>
      <CreateMessage getAllMessages={getAllMessages} />
      <br />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {messages.map((message) => (
          <MessageForm
            key={message._id}
            message={message}
            getAllMessages={getAllMessages}
          />
        ))}
      </div>
    </Container>
  );
};

export default HomeContent;
