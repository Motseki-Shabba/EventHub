"use client";

import { createContext } from "react";

export interface IAttendee {
  id?: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber: string;
  roles?: IAttendeeRole[];
}

export interface IUser {
  username: string;
  name: string;
  surname: string;
  emailAddress: string;
  password: string;
}

export interface ILoginData {
  userNameOrEmailAddress: string;
  password: string;
}

export interface IAttendeeRole {
  userId: number;
  roleId: number;
}

export interface IAttendeeStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  CurrentUser?: IUser;
  jwtToken?: string;
  currentRole?: string;
}

export interface IAttendeeActionContext {
  loginAttendee: (loginData: ILoginData) => Promise<void>;
  getCurrentUser: (jwtToken: string) => Promise<void>;
  createAttendee: (attendee: IAttendee) => Promise<void>;
  signOut: () => void;
  resetStateFlags: () => void;
  updateRole: (role: string) => void;
}

export const INITIAL_STATE: IAttendeeStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  CurrentUser: undefined,
};

export const AttendeeStateContext =
  createContext<IAttendeeStateContext>(INITIAL_STATE);

export const AttendeeActionContext = createContext<IAttendeeActionContext>({
  loginAttendee: async () => {},
  getCurrentUser: async () => {},
  createAttendee: async () => {},
  signOut: () => {},
  resetStateFlags: () => {},
  updateRole: () => {},
});
