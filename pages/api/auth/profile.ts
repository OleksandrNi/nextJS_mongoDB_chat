import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { connectToMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

const handleProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      try {
        const session = await getSession({ req });

        if (!session) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }

        await connectToMongoDB();

        const user = await User.findById(session.user);

        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        res.status(200).json({ user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    }

    case "PUT": {
      try {
        const session = await getSession({ req });

        if (!session) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }

        const { name, surname, address, phone } = req.body;

        await connectToMongoDB();

        const user = await User.findById(session.user);

        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.address = address || user.address;
        user.phone = phone || user.phone;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    }

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
};

export default handleProfile;
