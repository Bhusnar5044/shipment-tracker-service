// src/services/ShipmentService.ts

import { IShipment, Shipment } from "@/models/shipment.model";

class ShipmentService {

    
  async createShipment(data: Partial<IShipment>): Promise<IShipment> {
    const shipment = new Shipment(data);
    return shipment.save();
  }

  async listShipments(manager: boolean, customerId?: string): Promise<IShipment[]> {
    const query = manager ? { isDeleted: false } : { customer: customerId, isDeleted: false };
    return Shipment.find(query).populate('customer');
  }

  async getShipmentById(id: string): Promise<IShipment | null> {
    return Shipment.findOne({ _id: id, isDeleted: false }).populate('customer');
  }

  async updateShipment(id: string, data: Partial<IShipment>): Promise<IShipment | null> {
    return Shipment.findByIdAndUpdate(id, data, { new: true }).populate('customer');
  }

  async softDeleteShipment(id: string): Promise<IShipment | null> {
    return Shipment.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async trackShipment(trackingId: string): Promise<IShipment | null> {
    return Shipment.findOne({ trackingId, isDeleted: false }).populate('customer');
  }
}

export const shipmentService = new ShipmentService();
