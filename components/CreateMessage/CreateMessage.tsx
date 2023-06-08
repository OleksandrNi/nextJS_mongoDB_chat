import React, { useState } from "react";
import Button from "../Button";
import InputFeild from "../InputFeild/InputFeild";
import axios from "axios";

import styles from "./CreateMessage.module.scss";

interface CreateMessageProps {
  getAllMessages: () => Promise<void>;
}

const CreateMessage: React.FC<CreateMessageProps> = ({ getAllMessages }) => {
  const [loading, setLoading] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleNewTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError("");
    setNewTitle(event.target.value);
  };

  const handleNewContentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSubmitError("");
    setNewContent(event.target.value);
  };

  const handleCreateMessage = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiRes = await axios.post(
        `${process.env.NEXTAUTH_URL}/api/messages/create`,
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
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating message:", error);
      setSubmitError("Error creating message");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <InputFeild
        type="text"
        placeholder={"Title"}
        value={newTitle}
        name="Title"
        onChange={handleNewTitleChange}
      />
      <InputFeild
        type="text"
        placeholder={"Content"}
        value={newContent}
        name="Content"
        onChange={handleNewContentChange}
      />
      <Button
        onClick={handleCreateMessage}
        title={"Create Message"}
        type="button"
        disabled={loading}
      />
      {submitError && <p>{submitError}</p>}
    </div>
  );
};

export default CreateMessage;
