import { handleActions } from "redux-actions";
import { INITIAL_STATE, IAttendeeStateContext } from "@/Providers/Auth/context";
import { AttendeeActionEnums } from "./actions";

export const AttendeeReducer = handleActions<IAttendeeStateContext>(
  {
    // Handling login actions
    [AttendeeActionEnums.loginAttendeePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AttendeeActionEnums.loginAttendeeSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AttendeeActionEnums.loginAttendeeError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling get current attendee actions
    [AttendeeActionEnums.getCurrentAttendeePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AttendeeActionEnums.getCurrentAttendeeSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AttendeeActionEnums.getCurrentAttendeeError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling create attendee actions
    [AttendeeActionEnums.createAttendeePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AttendeeActionEnums.createAttendeeSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AttendeeActionEnums.createAttendeeError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [AttendeeActionEnums.signOutAttendee]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [AttendeeActionEnums.resetStateFlagsAction]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [AttendeeActionEnums.updateRoleAction]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
