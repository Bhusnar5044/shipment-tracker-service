import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import UserService from '@services/users.service';
import CustomerService from '@services/customer.service';

import { IUser } from '@/models/user.model';
import { ICustomer } from '@/models/customer.model';
import { email } from 'envalid';

class CustomerController {
  public userService = new UserService();
  public customerService = new CustomerService();

  public getAllCustomersIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: ICustomer[] = await this.customerService.findAllUser();

      const data = findAllUsersData.map(item => ({id: item._id, email: item.email}))

      res.status(200).json({ data, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: ICustomer = await this.customerService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ICustomer = req.body;
      const customerData: ICustomer = await this.customerService.createUser(userData);
      await this.userService.createUser({email:userData.email, password: userData.password, role: userData.role});

      res.status(201).json({ data: customerData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: Partial<ICustomer> = req.body;
      const updateUserData: IUser = await this.customerService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: IUser = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CustomerController;
