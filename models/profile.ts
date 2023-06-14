import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  surname: string;
  address: string;
  phone: number;
  email: string;
  basket: IOrder[];
}

export interface IOrder {
  itemId: string;
  quantity: number;
}

const OrderSchema = new Schema<IOrder>(
  {
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    basket: [OrderSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", ProfileSchema);
