"use client";
import { getAxiosInstace } from "@/Utils/axios-instance";
import { useContext, useReducer } from "react";
import {
  createEventError,
  createEventPending,
  createEventSuccess,
  deleteEventError,
  deleteEventPending,
  deleteEventSuccess,
  getAllEventsError,
  getAllEventsPending,
  getAllEventsSuccess,
  getEventByIdError,
  getEventByIdPending,
  getEventByIdSuccess,
  resetStateFlagsAction,
  updateEventError,
  updateEventPending,
  updateEventSuccess,
} from "@/Providers/Event/actions";
import {
  EventActionContext,
  EventStateContext,
  IEvent,
  INITIAL_STATE,
} from "@/Providers/Event/context";
import { EventReducer } from "@/Providers/Event/reducer";

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(EventReducer, INITIAL_STATE);
  const instance = getAxiosInstace();

  const createEvent = async (event: IEvent) => {
    dispatch(createEventPending());
    const endpoint = `/api/services/app/Event/CreateEvent`;

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await instance.post(endpoint, event, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        dispatch(createEventSuccess(response.data.result));
      } else {
        throw new Error("Failed to create event");
      }
    } catch {
      const backendMessage = "Failed to create event";
      dispatch(createEventError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const getAllEvents = async () => {
    dispatch(getAllEventsPending());
    const endpoint = `/api/services/app/Event/GetAllEvents`;

    try {
      const response = await instance.get(endpoint);

      if (response.status === 200 && response.data) {
        dispatch(getAllEventsSuccess(response.data.result));
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch {
      const backendMessage = "Failed to fetch events";
      dispatch(getAllEventsError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const getEventById = async (id: string) => {
    dispatch(getEventByIdPending());
    const endpoint = `/api/services/app/Event/GetEventById?id=${id}`;

    try {
      const response = await instance.get(endpoint);

      if (response.status === 200 && response.data) {
        dispatch(getEventByIdSuccess(response.data.result));
      } else {
        throw new Error("Failed to fetch event");
      }
    } catch {
      const backendMessage = "Failed to fetch event";
      dispatch(getEventByIdError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const deleteEvent = async (id: string) => {
    dispatch(deleteEventPending());
    const endpoint = `/api/services/app/Event/Delete?id=${id}`;

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await instance.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        dispatch(deleteEventSuccess());
      } else {
        throw new Error("Failed to delete event");
      }
    } catch {
      const backendMessage = "Failed to delete event";
      dispatch(deleteEventError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const updateEvent = async (event: IEvent) => {
    dispatch(updateEventPending());
    const endpoint = `/api/services/app/Event/UpdateEvent`;

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await instance.put(endpoint, event, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        dispatch(updateEventSuccess(response.data.result));
      } else {
        throw new Error("Failed to update event");
      }
    } catch {
      const backendMessage = "Failed to update event";
      dispatch(updateEventError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const resetStateFlags = () => {
    dispatch(resetStateFlagsAction());
  };

  return (
    <EventStateContext.Provider value={state}>
      <EventActionContext.Provider
        value={{
          createEvent,
          getAllEvents,
          getEventById,
          deleteEvent,
          updateEvent,
          resetStateFlags,
        }}
      >
        {children}
      </EventActionContext.Provider>
    </EventStateContext.Provider>
  );
};

export const useEventState = () => {
  const context = useContext(EventStateContext);
  if (!context) {
    throw new Error("useEventState must be used within an EventProvider");
  }
  return context;
};

export const useEventActions = () => {
  const context = useContext(EventActionContext);
  if (!context) {
    throw new Error("useEventActions must be used within an EventProvider");
  }
  return context;
};
