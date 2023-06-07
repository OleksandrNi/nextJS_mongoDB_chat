import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from '../../../lib/mongodb';
import Message from '../../../models/message';

const handleMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToMongoDB();

    const { id } = req.query;

    // Проверяем наличие сообщения по его идентификатору
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    switch (req.method) {
      case 'GET':
        // Возвращаем найденное сообщение
        return res.status(200).json({ success: true, message });
      case 'PUT':
      case 'POST':
        // Обновляем данные сообщения
        message.title = req.body.title;
        message.content = req.body.content;
        await message.save();
        return res.status(200).json({ success: true, message });
      case 'DELETE':
        // Удаляем сообщение
        await message.remove();
        return res.status(200).json({ success: true });
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handleMessage;

