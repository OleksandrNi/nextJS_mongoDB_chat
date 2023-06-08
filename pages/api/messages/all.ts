import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from '../../../lib/mongodb';
import Message from '../../../models/message';


const getAllMessagesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToMongoDB();

    const messages = await Message.find();

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getAllMessagesHandler;
