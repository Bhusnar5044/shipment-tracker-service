import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User, IUser } from '@models/user.model';
import { isEmpty } from '@utils/util';
import { Document } from 'mongoose';

class AuthService {
  public users = User;

  public async signup(userData: CreateUserDto): Promise<{ cookie: string; user: IUser; tokenData: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email }).exec();
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const user: IUser = await this.users.create({ ...userData, password: hashedPassword });

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, user, tokenData };

  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; user: IUser; tokenData: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const email = userData.email

    const user: IUser = await this.users.findOne({ email }).exec();

    if (!user) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    return { cookie, user, tokenData };
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email, password: userData.password }).exec();
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
