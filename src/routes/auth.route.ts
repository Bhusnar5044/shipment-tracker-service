import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto, CreateLoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { authMiddleware } from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router: Router;
  public authController = new AuthController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}login`, validationMiddleware(CreateLoginUserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
