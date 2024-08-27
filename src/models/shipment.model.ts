import { Document, Schema, model } from 'mongoose';
import { ICustomer } from './customer.model';

export interface IShipment extends Document {
  customerId: ICustomer['email']; // Reference to a customer ID
  origin: string;
  destination: string;
  currentStatus: 'Pending' | 'In Transit' | 'Arrived' | 'Delivered' | 'Cancelled';
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  containerNumbers: string[];
  cargoDetails: {
    description: string;
    weight: number; // In kilograms
    volume: number; // In cubic meters
  };
  shippingAgent: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  shipmentId: string;
  trackingId: string;
}

const shipmentSchema = new Schema<IShipment>(
  {
    customerId: { type: String, ref: 'Customer', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    currentStatus: {
      type: String,
      enum: ['Pending', 'In Transit', 'Arrived', 'Delivered', 'Cancelled'],
      default: 'Pending',
      required: true,
    },
    estimatedDeliveryDate: { type: Date, required: true },
    actualDeliveryDate: { type: Date },
    containerNumbers: { type: [String], required: true },
    cargoDetails: {
      description: { type: String, required: true },
      weight: { type: Number, required: true },
      volume: { type: Number, required: true },
    },
    shippingAgent: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    shipmentId: { type: String, unique: true, required: true },
    trackingId: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export const Shipment = model<IShipment>('Shipment', shipmentSchema);


// demo data
const shipmentData = {
  shipmentId: "SHIP20240825001",
  customer: "64f8b2f4c3d6e2a4a9dcd456",
  origin: "Port of Shanghai",
  destination: "Port of Los Angeles",
  currentStatus: "Pending",
  estimatedDeliveryDate: new Date("2024-09-15T15:00:00Z"),
  containerNumbers: ["CONT12345678", "CONT87654321"],
  cargoDetails: {
    description: "Electronics and Machinery",
    weight: 20000,
    volume: 120
  },
  shippingAgent: "Oceanic Shipping Co.",
  trackingId: "TRACK123456"
};
