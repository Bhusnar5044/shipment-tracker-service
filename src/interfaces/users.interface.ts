export interface User {
  _id: string;
  email: string;
  password: string;
}

export type Role = 'Admin' | 'Manager' | 'Customer'
