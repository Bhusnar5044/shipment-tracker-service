import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { Customer, ICustomer } from '@models/customer.model';
import { isEmpty } from '@utils/util';

class CustomerService {
  public users = Customer;

  public async findAllUser(): Promise<ICustomer[]> {
    const users: ICustomer[] = await this.users.find();
    return users;
  }
  
  public async findUserById(userId: string): Promise<ICustomer> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: ICustomer = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: ICustomer): Promise<ICustomer> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: ICustomer = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: ICustomer = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: Partial<ICustomer>): Promise<ICustomer> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.email) {
      const findUser: ICustomer = await this.users.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: ICustomer = await this.users.findByIdAndUpdate(userId, { userData });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<ICustomer> {
    const deleteUserById: ICustomer = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}

export default CustomerService;
