// src/models/Customer.ts
import { Schema, model, Document } from 'mongoose';

export interface ICustomer extends Document {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    preferredCarriers: string[];
    shippingMethods: string[]; // Should include "Sea" as an option
    preferredPorts: {
      originPort: string;
      destinationPort: string;
    }[];
  };
  role: 'Customer',
  password: string;
}

const customerSchema = new Schema<ICustomer>(
  {
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    preferences: {
      preferredCarriers: { type: [String], required: true },
      shippingMethods: { type: [String], required: true },
      preferredPorts: [
        {
          originPort: { type: String, required: true },
          destinationPort: { type: String, required: true },
        },
      ],
    },
    password: { type: String},
    role: { type: String, enum: ['Customer'], required: true },
  },
  { timestamps: true }
);

export const Customer = model<ICustomer>('Customer', customerSchema);


//Demoo customer data
const customerData = {
    companyName: "Maritime Logistics Inc.",
    contactName: "Jane Smith",
    email: "jane.smith@maritimelogistics.com",
    phone: "+1-555-987-6543",
    address: {
      street: "456 Ocean Ave",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    preferences: {
      preferredCarriers: ["Maersk", "MSC"],
      shippingMethods: ["Sea"],
      preferredPorts: [
        {
          originPort: "Port of Miami",
          destinationPort: "Port of Rotterdam"
        }
      ]
    },
  };
  