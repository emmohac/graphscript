import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  applications: Array<any>;
}

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  applications?: Array<any>;
};
