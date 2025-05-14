"use client";

import { createContext } from "react";

export interface ITicket {
  name: string;
  description: string;
  price: number;
  quantity: number;
  remainingQuantity?: number;
  type: number;
  eventId?: string;
  id?: string;
}

export interface IEvent {
  id?: string;
  name: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string;
  price: number;
  imageUrl: string | null;
  organizerIds: string[];
  tickets: ITicket[];
}

// New interface for ticket purchase request
export interface ITicketPurchaseRequest {
  ticketId: string;
  quantity: number;
}

// New interface for ticket purchase response
export interface ITicketPurchaseResponse {
  success: boolean;
  ticketId: string;
  eventId: string;
  eventName: string;
  ticketName: string;
  quantity: number;
  pricePerTicket: number;
  totalPrice: number;
  purchaseDate: string | Date;
  remainingTickets: number;
}

export interface IEventStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  events?: IEvent[];
  currentEvent?: IEvent;
  errorMessage?: string;
  // Add new state for ticket purchase
  ticketPurchaseResponse?: ITicketPurchaseResponse;
}

export interface IEventActionContext {
  createEvent: (event: IEvent) => Promise<void>;
  getAllEvents: () => Promise<void>;
  getEventById: (id: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEvent: (event: IEvent) => Promise<void>;
  // Add new purchase tickets action
  purchaseTickets: (
    request: ITicketPurchaseRequest
  ) => Promise<ITicketPurchaseResponse>;
  resetStateFlags: () => void;
}

export const INITIAL_STATE: IEventStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  events: [],
  currentEvent: undefined,
  errorMessage: undefined,
};

export const EventStateContext =
  createContext<IEventStateContext>(INITIAL_STATE);

export const EventActionContext = createContext<IEventActionContext>({
  createEvent: async () => {},
  getAllEvents: async () => {},
  getEventById: async () => {},
  deleteEvent: async () => {},
  updateEvent: async () => {},
  purchaseTickets: async () => {
    return {} as ITicketPurchaseResponse;
  },
  resetStateFlags: () => {},
});
