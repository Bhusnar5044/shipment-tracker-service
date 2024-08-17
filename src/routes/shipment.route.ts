import { Router } from 'express';
import { authMiddleware, authorize } from '@/middlewares/auth.middleware';
import ShipmentController from '@/controllers/shipment.controller';
import { Routes } from '@/interfaces/routes.interface';

class ShipmentRoute implements Routes {
  public router: Router;
  public path = '/shipment';
  public shipmentController = new ShipmentController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', authMiddleware, authorize(['Manager', 'Admin']), this.shipmentController.createShipment);
    this.router.get('/', authMiddleware, authorize(['Manager', 'Admin']), this.shipmentController.getShipments);
    this.router.get('/:id', authMiddleware, authorize(['Manager', 'Admin']), this.shipmentController.getShipmentById);
    this.router.put('/:id', authMiddleware, authorize(['Manager', 'Admin']), this.shipmentController.updateShipment);
    this.router.delete('/:id', authMiddleware, authorize(['Manager', 'Admin']), this.shipmentController.deleteShipment);
    // Track a shipment by tracking ID
    this.router.get('/track/:trackingId', authMiddleware, this.shipmentController.trackShipment);
  }
}

export default ShipmentRoute;
