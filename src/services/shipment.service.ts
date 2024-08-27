// src/services/ShipmentService.ts

import { IShipment, Shipment } from "@/models/shipment.model";

class ShipmentService {
  
  async createShipment(data: Partial<IShipment>): Promise<IShipment> {
    const shipment = new Shipment(data);
    return shipment.save();
  }

  async listShipments(customerId?: string): Promise<IShipment[]> {
    const query = customerId ? { customer: customerId, isDeleted: false } : { isDeleted: false };
    return Shipment.find(query);
  }

  async getShipmentById(id: string): Promise<IShipment | null> {
    return Shipment.findOne({ _id: id, isDeleted: false }).exec();
  }

  async updateShipment(id: string, data: Partial<IShipment>): Promise<IShipment | null> {
    return Shipment.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteShipment(id: string): Promise<IShipment | null> {
    return Shipment.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async trackShipment(trackingId: string): Promise<IShipment | null> {
    return Shipment.findOne({ trackingId, isDeleted: false });
  }
}

export const shipmentService = new ShipmentService();
