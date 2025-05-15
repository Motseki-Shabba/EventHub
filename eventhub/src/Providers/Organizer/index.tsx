"use client";
import { getAxiosInstace } from "@/Utils/axios-instance";
import { useContext, useReducer } from "react";
import {
  createOrganizerError,
  createOrganizerPending,
  createOrganizerSuccess,
  deleteOrganizerError,
  deleteOrganizerPending,
  deleteOrganizerSuccess,
  getAllOrganizersError,
  getAllOrganizersPending,
  getAllOrganizersSuccess,
  getOrganizerByIdError,
  getOrganizerByIdPending,
  getOrganizerByIdSuccess,
  getOrganizerByUserIdError,
  getOrganizerByUserIdPending,
  getOrganizerByUserIdSuccess,
  resetStateFlagsAction,
  updateOrganizerError,
  updateOrganizerPending,
  updateOrganizerSuccess,
} from "@/Providers/Organizer/actions";
import {
  OrganizerActionContext,
  OrganizerStateContext,
  IOrganizer,
  INITIAL_STATE,
} from "@/Providers/Organizer/context";
import { OrganizerReducer } from "@/Providers/Organizer/reducer";

export const OrganizerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(OrganizerReducer, INITIAL_STATE);
  const instance = getAxiosInstace();

  const createOrganizer = async (organizer: IOrganizer) => {
    dispatch(createOrganizerPending());
    const endpoint = `/api/services/app/Organizer/Create`;

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await instance.post(endpoint, organizer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        debugger;
        dispatch(createOrganizerSuccess(response.data.result));
      } else {
        throw new Error("Failed to create organizer");
      }
    } catch {
      debugger;
      const backendMessage = "Failed to create organizer";
      dispatch(createOrganizerError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const getAllOrganizers = async () => {
    dispatch(getAllOrganizersPending());
    const endpoint = `/api/services/app/Organizer/GetAll`;

    try {
      const response = await instance.get(endpoint);

      if (response.status === 200 && response.data) {
        dispatch(getAllOrganizersSuccess(response.data.result.items));
      } else {
        throw new Error("Failed to fetch organizers");
      }
    } catch {
      const backendMessage = "Failed to fetch organizers";
      dispatch(getAllOrganizersError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const getOrganizerById = async (id: string) => {
    dispatch(getOrganizerByIdPending());
    const endpoint = `/api/services/app/Organizer/Get?id=${id}`;

    try {
      const response = await instance.get(endpoint);

      if (response.status === 200 && response.data) {
        dispatch(getOrganizerByIdSuccess(response.data.result));
      } else {
        throw new Error("Failed to fetch organizer");
      }
    } catch {
      const backendMessage = "Failed to fetch organizer";
      dispatch(getOrganizerByIdError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const getOrganizerByUserId = async (userId: number) => {
    dispatch(getOrganizerByUserIdPending());
    const endpoint = `/api/services/app/Organizer/GetByUserId?userId=${userId}`;

    try {
      const response = await instance.get(endpoint);

      if (response.status === 200 && response.data) {
        dispatch(getOrganizerByUserIdSuccess(response.data.result));
      } else {
        throw new Error("Failed to fetch organizer by user ID");
      }
    } catch {
      const backendMessage = "Failed to fetch organizer by user ID";
      dispatch(getOrganizerByUserIdError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const deleteOrganizer = async (id: string) => {
    dispatch(deleteOrganizerPending());
    const endpoint = `/api/services/app/Organizer/Delete?id=${id}`;

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
        dispatch(deleteOrganizerSuccess());
      } else {
        throw new Error("Failed to delete organizer");
      }
    } catch {
      const backendMessage = "Failed to delete organizer";
      dispatch(deleteOrganizerError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const updateOrganizer = async (organizer: IOrganizer) => {
    dispatch(updateOrganizerPending());
    const endpoint = `/api/services/app/Organizer/Update`;

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await instance.put(endpoint, organizer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        dispatch(updateOrganizerSuccess(response.data.result));
      } else {
        throw new Error("Failed to update organizer");
      }
    } catch {
      const backendMessage = "Failed to update organizer";
      dispatch(updateOrganizerError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const resetStateFlags = () => {
    dispatch(resetStateFlagsAction());
  };

  return (
    <OrganizerStateContext.Provider value={state}>
      <OrganizerActionContext.Provider
        value={{
          createOrganizer,
          getAllOrganizers,
          getOrganizerById,
          getOrganizerByUserId,
          deleteOrganizer,
          updateOrganizer,
          resetStateFlags,
        }}
      >
        {children}
      </OrganizerActionContext.Provider>
    </OrganizerStateContext.Provider>
  );
};

export const useOrganizerState = () => {
  const context = useContext(OrganizerStateContext);
  if (!context) {
    throw new Error(
      "useOrganizerState must be used within an OrganizerProvider"
    );
  }
  return context;
};

export const useOrganizerActions = () => {
  const context = useContext(OrganizerActionContext);
  if (!context) {
    throw new Error(
      "useOrganizerActions must be used within an OrganizerProvider"
    );
  }
  return context;
};
