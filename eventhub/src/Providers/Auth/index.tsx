"use client";
import { useContext, useEffect, useReducer } from "react";
import { AttendeeReducer } from "@/Providers/Auth/reducer";
import {
  AttendeeActionContext,
  AttendeeStateContext,
  ILoginData,
  INITIAL_STATE,
  IAttendee,
} from "./context";
import {
  getCurrentAttendeeError,
  getCurrentAttendeePending,
  getCurrentAttendeeSuccess,
  loginAttendeeError,
  loginAttendeePending,
  loginAttendeeSuccess,
  resetStateFlagsAction,
  signOutAttendee,
  createAttendeeError,
  createAttendeePending,
  createAttendeeSuccess,
  updateRoleAction,
} from "./actions";
import { getAxiosInstace } from "@/Utils/axios-instance";
import { getRole } from "@/Utils/jwtDecoder";

export const AttendeeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(AttendeeReducer, INITIAL_STATE);
  const instance = getAxiosInstace();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      const role = getRole(token);
      updateRole(role);
      getCurrentAttendee(token);
      dispatch(loginAttendeeSuccess(token));
    }
  }, []);

  const loginAttendee = async (loginData: ILoginData) => {
    dispatch(loginAttendeePending());

    debugger;
    const endpoint: string = `/api/TokenAuth/Authenticate`;

    await instance
      .post(endpoint, loginData)
      .then((response) => {
        sessionStorage.setItem("accessToken", response.data.result.accessToken);
        const role = getRole(response.data.result.accessToken);
        updateRole(role);
        getCurrentAttendee(response.data.result.accessToken);
        dispatch(loginAttendeeSuccess(response.data.result.accessToken));
      })
      .catch((error) => {
        console.error(error);
        dispatch(loginAttendeeError());
      });
  };

  const getCurrentAttendee = async (jwtToken: string) => {
    dispatch(getCurrentAttendeePending());
    const endpoint = `/api/services/app/Session/GetCurrentLoginInformations`;
    await instance
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          const currentAttendee: IAttendee = response.data.result.user;
          dispatch(getCurrentAttendeeSuccess(currentAttendee));
        }
      })
      .catch((error) => {
        console.error(error);
        dispatch(getCurrentAttendeeError());
      });
  };

  const createAttendee = async (attendee: IAttendee) => {
    dispatch(createAttendeePending());
    const endpoint = `/api/services/app/Attendee/Create`;

    await instance
      .post(endpoint, attendee)
      .then((response) => {
        if (response.status === 200) {
          dispatch(createAttendeeSuccess());
        }
      })
      .catch((error) => {
        console.error(error);
        const backendMessage = error.response?.data?.error?.message;
        dispatch(createAttendeeError());
        throw new Error(backendMessage);
      });
  };

  const signOut = () => {
    sessionStorage.clear();
    dispatch(signOutAttendee());
  };

  const resetStateFlags = async () => {
    dispatch(resetStateFlagsAction());
  };

  const updateRole = (role: string) => {
    dispatch(updateRoleAction(role));
  };

  return (
    <AttendeeStateContext.Provider value={state}>
      <AttendeeActionContext.Provider
        value={{
          loginAttendee,
          getCurrentAttendee,
          createAttendee,
          signOut,
          resetStateFlags,
          updateRole,
        }}
      >
        {children}
      </AttendeeActionContext.Provider>
    </AttendeeStateContext.Provider>
  );
};

export const useAttendeeState = () => {
  const context = useContext(AttendeeStateContext);
  if (!context) {
    throw new Error("useAttendeeState must be used within an AttendeeProvider");
  }
  return context;
};

export const useAttendeeActions = () => {
  const context = useContext(AttendeeActionContext);
  if (!context) {
    throw new Error(
      "useAttendeeActions must be used within an AttendeeProvider"
    );
  }
  return context;
};
