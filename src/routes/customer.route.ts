import { Router } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import CustomerController from '@/controllers/customer.controller';

class CustomerRoute implements Routes {
  public path = '/customers';
  public router: Router;
  public customerController = new CustomerController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.customerController.getAllCustomersIds);
    this.router.get(`${this.path}/:id`, this.customerController.getCustomerById);
    this.router.post(`${this.path}`, this.customerController.createCustomer);
    this.router.put(`${this.path}/:id`, this.customerController.updateUser);
    this.router.delete(`${this.path}/:id`, this.customerController.deleteUser);
  }
}

export default CustomerRoute;
