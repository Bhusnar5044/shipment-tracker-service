import { Shipment } from '@/models/shipment.model';
import { sendEmail } from '@/utils/email';
import { Request, Response } from 'express';

class ShipmentController {
  // Create a new shipment
  async createShipment(req: Request, res: Response): Promise<Response> {
    try {
      const { origin, destination, status, estimatedDeliveryDate } = req.body;
      const shipment = new Shipment({ origin, destination, status, estimatedDeliveryDate });
      await shipment.save();
      return res.status(201).json(shipment);
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  // Get all shipments
  async getShipments(req: Request, res: Response): Promise<Response> {
    try {
      const shipments = await Shipment.find({ isDeleted: false });
      return res.status(200).json(shipments);
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  // Get a single shipment by ID
  async getShipmentById(req: Request, res: Response): Promise<Response> {
    try {
      const shipment = await Shipment.findById(req.params.id);
      if (!shipment || shipment.isDeleted) {
        return res.status(404).json({ message: 'Shipment not found' });
      }
      return res.status(200).json(shipment);
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  // Update a shipment
  async updateShipment(req: Request, res: Response): Promise<Response> {
    try {
      const { origin, destination, status, estimatedDeliveryDate } = req.body;
      const shipment = await Shipment.findById(req.params.id);

      if (!shipment || shipment.isDeleted) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      const previousStatus = shipment.status;
      shipment.origin = origin || shipment.origin;
      shipment.destination = destination || shipment.destination;
      shipment.status = status || shipment.status;
      shipment.estimatedDeliveryDate = estimatedDeliveryDate || shipment.estimatedDeliveryDate;

      await shipment.save();

      // Send email notification if status has changed
      if (previousStatus !== shipment.status) {
        const emailSubject = `Your shipment status has changed to ${shipment.status}`;
        const emailBody = `
        <h1>Shipment Status Update</h1>
        <p>Your shipment with tracking ID <strong>${shipment.trackingId}</strong> is now <strong>${shipment.status}</strong>.</p>
        <p>Estimated delivery date: ${shipment.estimatedDeliveryDate.toDateString()}</p>
        <p>Origin: ${shipment.origin}</p>
        <p>Destination: ${shipment.destination}</p>
      `;
        await sendEmail('customer@example.com', emailSubject, emailBody); // Replace with actual customer email
      }

      return res.status(200).json(shipment);
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  // Soft delete a shipment
  async deleteShipment(req: Request, res: Response): Promise<Response> {
    try {
      const shipment = await Shipment.findById(req.params.id);

      if (!shipment || shipment.isDeleted) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      shipment.isDeleted = true;
      await shipment.save();
      return res.status(200).json({ message: 'Shipment deleted successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }

  // Track a shipment by tracking ID
  async trackShipment(req: Request, res: Response): Promise<Response> {
    try {
      const { trackingId } = req.params;
      const shipment = await Shipment.findOne({ trackingId, isDeleted: false });

      if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      return res.status(200).json({
        status: shipment.status,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        origin: shipment.origin,
        destination: shipment.destination,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
}

export default ShipmentController;
