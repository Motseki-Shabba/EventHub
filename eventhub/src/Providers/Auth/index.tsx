"use client";
import { AttendeeReducer } from "@/Providers/Auth/reducer";
import { getAxiosInstace } from "@/Utils/axios-instance";
import { getRole } from "@/Utils/jwtDecoder";
import { useContext, useEffect, useReducer } from "react";
import {
  createAttendeeError,
  createAttendeePending,
  createAttendeeSuccess,
  getCurrentUserError,
  getCurrentUserPending,
  getCurrentUserSuccess,
  loginAttendeeError,
  loginAttendeePending,
  loginAttendeeSuccess,
  resetStateFlagsAction,
  signOutAttendee,
  updateRoleAction,
} from "./actions";
import {
  AttendeeActionContext,
  AttendeeStateContext,
  IAttendee,
  ILoginData,
  INITIAL_STATE,
  IUser,
} from "./context";

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
      getCurrentUser(token);
      dispatch(loginAttendeeSuccess(token));
    }
  }, []);

  const loginAttendee = async (loginData: ILoginData) => {
    dispatch(loginAttendeePending());

    const endpoint: string = `/api/TokenAuth/Authenticate`;

    await instance
      .post(endpoint, loginData)

      .then((response) => {
        sessionStorage.setItem("accessToken", response.data.result.accessToken);

        const role = getRole(response.data.result.accessToken);
        updateRole(role);

        getCurrentUser(response.data.result.accessToken);
        dispatch(loginAttendeeSuccess(response.data.result.accessToken));
      })
      .catch((error) => {
        console.error("Auth Error: " + error);
        dispatch(loginAttendeeError());
      });
  };

  const getCurrentUser = async (jwtToken: string) => {
    dispatch(getCurrentUserPending());
    const endpoint = `/api/services/app/Session/GetCurrentLoginInformations`;
    await instance
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          const CurrentUser: IUser = response.data.result.user;
          dispatch(getCurrentUserSuccess(CurrentUser));
        }
      })
      .catch((error) => {
        console.error(error);
        dispatch(getCurrentUserError());
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
          getCurrentUser,
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
