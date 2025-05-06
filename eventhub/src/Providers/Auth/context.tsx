"use client";

import { createContext } from "react";

export interface IAttendee {
  id?: number;
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  roles?: IAttendeeRole[];
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
  currentAttendee?: IAttendee;
  jwtToken?: string;
  currentRole?: string;
}

export interface IAttendeeActionContext {
  loginAttendee: (loginData: ILoginData) => Promise<void>;
  getCurrentAttendee: (jwtToken: string) => Promise<void>;
  createAttendee: (attendee: IAttendee) => Promise<void>;
  signOut: () => void;
  resetStateFlags: () => void;
  updateRole: (role: string) => void;
}

export const INITIAL_STATE: IAttendeeStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  currentAttendee: undefined,
};

export const AttendeeStateContext =
  createContext<IAttendeeStateContext>(INITIAL_STATE);

export const AttendeeActionContext = createContext<IAttendeeActionContext>({
  loginAttendee: async () => {},
  getCurrentAttendee: async () => {},
  createAttendee: async () => {},
  signOut: () => {},
  resetStateFlags: () => {},
  updateRole: () => {},
});
