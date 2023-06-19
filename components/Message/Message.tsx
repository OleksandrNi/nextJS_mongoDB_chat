import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IMessage } from "../../models/message";
import { useSession } from "next-auth/react";
import styles from "./Message.module.scss";
import Button from "../Button";
import InputFeild from "../InputFeild";

const Message = () => {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState<IMessage>();
  const [newComment, setNewComment] = useState("");

  const [error, setError] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    getMessage();
  }, []);

  const getMessage = async () => {
    try {
      const apiRes = await axios.get(
        `${process.env.NEXTAUTH_URL}/api/messages/${id}`
      );

      if (apiRes?.data?.success) {
        setMessage(apiRes.data.message);
      }
    } catch (error) {
      console.error("Error retrieving messages:", error);
      setError("Error retrieving messages:");
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

      if (!newComment) return;

      const apiRes = await axios.patch(
        `${process.env.NEXTAUTH_URL}/api/messages/${id}`,
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
        getMessage();
      } else {
        console.error("Error adding comment:", apiRes?.data?.error);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  console.log("message", message);
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      {message ? (
        <div className={styles.message}>
          <div>Message author {message.author}</div>
          <div>Message content {message.content}</div>
          <div>
            <InputFeild
              placeholder="New Comment"
              type="text"
              onChange={handleNewCommentChange}
              value={newComment}
            />
            <Button title={"Add comment"} onClick={handleAddComment} />
          </div>
          {message.comments.map((comment) => (
            <div key={comment._id}>
              {comment.content} {comment.author}
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Message;
