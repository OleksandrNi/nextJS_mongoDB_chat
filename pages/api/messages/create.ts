import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB } from "../../../lib/mongodb";
import Message from "../../../models/message";
import { getSession } from "next-auth/react";

const createMessageHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await connectToMongoDB();

    const { title, content } = req.body;

    const message = await Message.create({
      title,
      content,
      author: session?.user?.email,
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createMessageHandler;
