import { Shipment } from '@/models/shipment.model';
import { shipmentService } from '@/services/shipment.service';
import { sendEmail } from '@/utils/email';
import { NextFunction, Request, Response } from 'express';
import ShortUniqueId from 'short-unique-id';


class ShipmentController {
  // Create a new shipment
  async createShipment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const uid = new ShortUniqueId({ length: 10 });
      const shipmentId = `SHIP${uid.rnd()}`
      const trackingId = `TRACK${uid.rnd()}`
      const data = {...req.body, trackingId, shipmentId};
      const shipment = await shipmentService.createShipment(data);

      return res.status(201).json({data: shipment});
    } catch (error) {
      next(error);
    }
  }

  // Get all shipments
  async getShipments(req: Request, res: Response,  next: NextFunction): Promise<Response> {
    const customerId = req.params.id;
    try {
      const shipments = await shipmentService.listShipments(customerId);

      return res.status(200).json({data: {
        list: shipments,
        totalCount: shipments.length
    }});
    } catch (error) {
      next(error);
    }
  }

  // Get a single shipment by ID
  async getShipmentById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const shipment = await shipmentService.getShipmentById(req.params.id);

      if (!shipment || shipment.isDeleted) {
        return res.status(404).json({ message: 'Shipment not found' });
      }
      return res.status(200).json({data: shipment});
    } catch (error) {
      next(error);
    }
  }

  // Update a shipment
  async updateShipment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const shipment = await Shipment.findById(req.params.id);

      if (!shipment || shipment.isDeleted) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      const previousStatus = shipment.currentStatus;

      const newShipment = await shipmentService.updateShipment(req.params.id, req.body);

      // Send email notification if status has changed
      if (previousStatus !== newShipment.currentStatus) {
        const emailSubject = `Your shipment status has changed to ${newShipment.currentStatus}`;
        const emailBody = `
        <h1>Shipment Status Update</h1>
        <p>Your shipment with tracking ID <strong>${newShipment.trackingId}</strong> is now <strong>${newShipment.currentStatus}</strong>.</p>
        <p>Estimated delivery date: ${newShipment.estimatedDeliveryDate.toDateString()}</p>
        <p>Origin: ${newShipment.origin}</p>
        <p>Destination: ${newShipment.destination}</p>
      `;
        await sendEmail('customer@example.com', emailSubject, emailBody); // Replace with actual customer email
      }

      return res.status(200).json({data: newShipment});
    } catch (error) {
      next(error);
    }
  }

  // Soft delete a shipment
  async deleteShipment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const id = req.params.id;
      const shipment = await shipmentService.softDeleteShipment(id);

      if (!shipment || shipment.isDeleted) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      shipment.isDeleted = true;
      await shipment.save();
      return res.status(200).json({ message: 'Shipment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Track a shipment by tracking ID
  async trackShipment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { trackingId } = req.params;
      const shipment = await shipmentService.trackShipment(trackingId);

      if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      return res.status(200).json({data:{
        currentStatus: shipment.currentStatus,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        origin: shipment.origin,
        destination: shipment.destination,
      }});
      
    } catch (error) {
      next(error);
    }
  }
}

export default ShipmentController;
