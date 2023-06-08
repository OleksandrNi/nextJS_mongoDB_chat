import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from '../../../lib/mongodb';
import Message, { IMessage, IComment } from '../../../models/message';

const handleMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToMongoDB();

    const { id } = req.query;
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json({ success: true, message });
      case 'PUT':
      case 'POST':
        message.title = req.body.title;
        message.content = req.body.content;
        await message.save();
        return res.status(200).json({ success: true, message });
      case 'DELETE':
        await message.remove();
        return res.status(200).json({ success: true });
      case 'PATCH':
        const { content, author } = req.body;

        const newComment: IComment = {
          content,
          author,
        };

        message.comments.push(newComment);
        await message.save();
        return res.status(200).json({ success: true, message });
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handleMessage;
