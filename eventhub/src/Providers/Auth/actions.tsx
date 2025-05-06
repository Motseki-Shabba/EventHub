import { createAction } from "redux-actions";
import { IAttendee, IAttendeeStateContext } from "./context";

export enum AttendeeActionEnums {
  loginAttendeePending = "LOGIN_ATTENDEE_PENDING",
  loginAttendeeSuccess = "LOGIN_ATTENDEE_SUCCESS",
  loginAttendeeError = "LOGIN_ATTENDEE_ERROR",

  getCurrentAttendeePending = "GET_CURRENT_ATTENDEE_PENDING",
  getCurrentAttendeeSuccess = "GET_CURRENT_ATTENDEE_SUCCESS",
  getCurrentAttendeeError = "GET_CURRENT_ATTENDEE_ERROR",

  createAttendeePending = "CREATE_ATTENDEE_PENDING",
  createAttendeeSuccess = "CREATE_ATTENDEE_SUCCESS",
  createAttendeeError = "CREATE_ATTENDEE_ERROR",

  signOutAttendee = "SIGN_OUT_ATTENDEE",
  resetStateFlagsAction = "RESET_STATE_FLAGS",
  updateRoleAction = "UPDATE_ROLE",
}

export const loginAttendeePending = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.loginAttendeePending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const loginAttendeeSuccess = createAction<IAttendeeStateContext, string>(
  AttendeeActionEnums.loginAttendeeSuccess,
  (jwtToken: string) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    jwtToken,
  })
);
export const loginAttendeeError = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.loginAttendeeError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

export const getCurrentAttendeePending = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.getCurrentAttendeePending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getCurrentAttendeeSuccess = createAction<
  IAttendeeStateContext,
  IAttendee
>(
  AttendeeActionEnums.getCurrentAttendeeSuccess,
  (currentAttendee: IAttendee) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentAttendee,
  })
);
export const getCurrentAttendeeError = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.getCurrentAttendeeError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

export const createAttendeePending = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.createAttendeePending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const createAttendeeSuccess = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.createAttendeeSuccess,
  () => ({ isPending: false, isSuccess: true, isError: false })
);
export const createAttendeeError = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.createAttendeeError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
export const signOutAttendee = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.signOutAttendee,
  () => ({
    isPending: false,
    isSuccess: false,
    isError: false,
    currentAttendee: {
      id: -1,
      userName: "",
      name: "",
      surname: "",
      emailAddress: "",
      password: "",
      phoneNumber: "",
    },
    jwtToken: undefined,
    currentRole: undefined,
  })
);
export const resetStateFlagsAction = createAction<IAttendeeStateContext>(
  AttendeeActionEnums.resetStateFlagsAction,
  () => ({ isPending: false, isSuccess: false, isError: false })
);
export const updateRoleAction = createAction<IAttendeeStateContext, string>(
  AttendeeActionEnums.updateRoleAction,
  (currentRole: string) => ({
    isPending: true,
    isSuccess: false,
    isError: false,
    currentRole,
  })
);
