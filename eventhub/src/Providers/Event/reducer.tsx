import { handleActions } from "redux-actions";
import { INITIAL_STATE, IEventStateContext } from "@/Providers/Event/context";
import { EventActionEnums } from "@/Providers/Event/actions";

export const EventReducer = handleActions<IEventStateContext>(
  {
    // Handling create event actions
    [EventActionEnums.createEventPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.createEventSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.createEventError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling get all events actions
    [EventActionEnums.getAllEventsPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.getAllEventsSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.getAllEventsError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling get event by id actions
    [EventActionEnums.getEventByIdPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.getEventByIdSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.getEventByIdError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling delete event actions
    [EventActionEnums.deleteEventPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.deleteEventSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.deleteEventError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling update event actions
    [EventActionEnums.updateEventPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.updateEventSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.updateEventError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling purchase tickets actions
    [EventActionEnums.purchaseTicketsPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.purchaseTicketsSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [EventActionEnums.purchaseTicketsError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling reset state flags action
    [EventActionEnums.resetStateFlagsAction]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
