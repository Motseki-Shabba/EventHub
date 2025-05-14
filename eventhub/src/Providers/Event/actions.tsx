import { createAction } from "redux-actions";
import {
  IEvent,
  IEventStateContext,
  ITicketPurchaseResponse,
} from "@/Providers/Event/context";

export enum EventActionEnums {
  createEventPending = "CREATE_EVENT_PENDING",
  createEventSuccess = "CREATE_EVENT_SUCCESS",
  createEventError = "CREATE_EVENT_ERROR",

  getAllEventsPending = "GET_ALL_EVENTS_PENDING",
  getAllEventsSuccess = "GET_ALL_EVENTS_SUCCESS",
  getAllEventsError = "GET_ALL_EVENTS_ERROR",

  getEventByIdPending = "GET_EVENT_BY_ID_PENDING",
  getEventByIdSuccess = "GET_EVENT_BY_ID_SUCCESS",
  getEventByIdError = "GET_EVENT_BY_ID_ERROR",

  deleteEventPending = "DELETE_EVENT_PENDING",
  deleteEventSuccess = "DELETE_EVENT_SUCCESS",
  deleteEventError = "DELETE_EVENT_ERROR",

  updateEventPending = "UPDATE_EVENT_PENDING",
  updateEventSuccess = "UPDATE_EVENT_SUCCESS",
  updateEventError = "UPDATE_EVENT_ERROR",

  // New actions for ticket purchase
  purchaseTicketsPending = "PURCHASE_TICKETS_PENDING",
  purchaseTicketsSuccess = "PURCHASE_TICKETS_SUCCESS",
  purchaseTicketsError = "PURCHASE_TICKETS_ERROR",

  resetStateFlagsAction = "RESET_STATE_FLAGS",
}

export const createEventPending = createAction<IEventStateContext>(
  EventActionEnums.createEventPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const createEventSuccess = createAction<IEventStateContext, IEvent>(
  EventActionEnums.createEventSuccess,
  (event: IEvent) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentEvent: event,
  })
);
export const createEventError = createAction<IEventStateContext, string>(
  EventActionEnums.createEventError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const getAllEventsPending = createAction<IEventStateContext>(
  EventActionEnums.getAllEventsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getAllEventsSuccess = createAction<IEventStateContext, IEvent[]>(
  EventActionEnums.getAllEventsSuccess,
  (events: IEvent[]) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    events,
  })
);
export const getAllEventsError = createAction<IEventStateContext, string>(
  EventActionEnums.getAllEventsError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const getEventByIdPending = createAction<IEventStateContext>(
  EventActionEnums.getEventByIdPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getEventByIdSuccess = createAction<IEventStateContext, IEvent>(
  EventActionEnums.getEventByIdSuccess,
  (event: IEvent) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentEvent: event,
  })
);
export const getEventByIdError = createAction<IEventStateContext, string>(
  EventActionEnums.getEventByIdError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const deleteEventPending = createAction<IEventStateContext>(
  EventActionEnums.deleteEventPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const deleteEventSuccess = createAction<IEventStateContext>(
  EventActionEnums.deleteEventSuccess,
  () => ({
    isPending: false,
    isSuccess: true,
    isError: false,
  })
);
export const deleteEventError = createAction<IEventStateContext, string>(
  EventActionEnums.deleteEventError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const updateEventPending = createAction<IEventStateContext>(
  EventActionEnums.updateEventPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const updateEventSuccess = createAction<IEventStateContext, IEvent>(
  EventActionEnums.updateEventSuccess,
  (event: IEvent) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentEvent: event,
  })
);
export const updateEventError = createAction<IEventStateContext, string>(
  EventActionEnums.updateEventError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

// New actions for ticket purchase
export const purchaseTicketsPending = createAction<IEventStateContext>(
  EventActionEnums.purchaseTicketsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const purchaseTicketsSuccess = createAction<
  IEventStateContext,
  ITicketPurchaseResponse
>(
  EventActionEnums.purchaseTicketsSuccess,
  (response: ITicketPurchaseResponse) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    ticketPurchaseResponse: response,
  })
);
export const purchaseTicketsError = createAction<IEventStateContext, string>(
  EventActionEnums.purchaseTicketsError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const resetStateFlagsAction = createAction<IEventStateContext>(
  EventActionEnums.resetStateFlagsAction,
  () => ({ isPending: false, isSuccess: false, isError: false })
);
