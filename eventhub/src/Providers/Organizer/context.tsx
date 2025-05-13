"use client";

import { createContext } from "react";

export interface IOrganizer {
  id?: string;
  name: string;
  surname: string;
  email: string;
  organisationName: string;
  username: string;
  password?: string;
  profileImageUrl: string | null;
  contactInfo: string;
  nationalIdNumber: string;
  eventHubAdmin: string;
  address: string;
  roleNames?: string[];
  events?: string[];
  tickets?: string[];
}

export interface IOrganizerStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  organizers?: IOrganizer[];
  currentOrganizer?: IOrganizer;
  errorMessage?: string;
}

export interface IOrganizerActionContext {
  createOrganizer: (organizer: IOrganizer) => Promise<void>;
  getAllOrganizers: () => Promise<void>;
  getOrganizerById: (id: string) => Promise<void>;
  getOrganizerByUserId: (userId: number) => Promise<void>;
  deleteOrganizer: (id: string) => Promise<void>;
  updateOrganizer: (organizer: IOrganizer) => Promise<void>;
  resetStateFlags: () => void;
}

export const INITIAL_STATE: IOrganizerStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  organizers: [],
  currentOrganizer: undefined,
  errorMessage: undefined,
};

export const OrganizerStateContext =
  createContext<IOrganizerStateContext>(INITIAL_STATE);

export const OrganizerActionContext = createContext<IOrganizerActionContext>({
  createOrganizer: async () => {},
  getAllOrganizers: async () => {},
  getOrganizerById: async () => {},
  getOrganizerByUserId: async () => {},
  deleteOrganizer: async () => {},
  updateOrganizer: async () => {},
  resetStateFlags: () => {},
});
