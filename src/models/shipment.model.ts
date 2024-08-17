import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IShipment extends Document {
  origin: string;
  destination: string;
  status: 'Pending' | 'In Transit' | 'Delivered';
  estimatedDeliveryDate: Date;
  trackingId: string;
  isDeleted: boolean;
}

const ShipmentSchema = new Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' },
  estimatedDeliveryDate: { type: Date, required: true },
  trackingId: { type: String, unique: true, default: uuidv4 },
  isDeleted: { type: Boolean, default: false },
});

export const Shipment = mongoose.model<IShipment>('Shipment', ShipmentSchema);
