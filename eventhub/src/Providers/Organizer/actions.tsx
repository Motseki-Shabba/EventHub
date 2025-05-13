import { createAction } from "redux-actions";
import {
  IOrganizer,
  IOrganizerStateContext,
} from "@/Providers/Organizer/context";

export enum OrganizerActionEnums {
  createOrganizerPending = "CREATE_ORGANIZER_PENDING",
  createOrganizerSuccess = "CREATE_ORGANIZER_SUCCESS",
  createOrganizerError = "CREATE_ORGANIZER_ERROR",

  getAllOrganizersPending = "GET_ALL_ORGANIZERS_PENDING",
  getAllOrganizersSuccess = "GET_ALL_ORGANIZERS_SUCCESS",
  getAllOrganizersError = "GET_ALL_ORGANIZERS_ERROR",

  getOrganizerByIdPending = "GET_ORGANIZER_BY_ID_PENDING",
  getOrganizerByIdSuccess = "GET_ORGANIZER_BY_ID_SUCCESS",
  getOrganizerByIdError = "GET_ORGANIZER_BY_ID_ERROR",

  getOrganizerByUserIdPending = "GET_ORGANIZER_BY_USER_ID_PENDING",
  getOrganizerByUserIdSuccess = "GET_ORGANIZER_BY_USER_ID_SUCCESS",
  getOrganizerByUserIdError = "GET_ORGANIZER_BY_USER_ID_ERROR",

  deleteOrganizerPending = "DELETE_ORGANIZER_PENDING",
  deleteOrganizerSuccess = "DELETE_ORGANIZER_SUCCESS",
  deleteOrganizerError = "DELETE_ORGANIZER_ERROR",

  updateOrganizerPending = "UPDATE_ORGANIZER_PENDING",
  updateOrganizerSuccess = "UPDATE_ORGANIZER_SUCCESS",
  updateOrganizerError = "UPDATE_ORGANIZER_ERROR",

  resetStateFlagsAction = "RESET_STATE_FLAGS",
}

export const createOrganizerPending = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.createOrganizerPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const createOrganizerSuccess = createAction<
  IOrganizerStateContext,
  IOrganizer
>(OrganizerActionEnums.createOrganizerSuccess, (organizer: IOrganizer) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  currentOrganizer: organizer,
}));
export const createOrganizerError = createAction<
  IOrganizerStateContext,
  string
>(OrganizerActionEnums.createOrganizerError, (errorMessage: string) => ({
  isPending: false,
  isSuccess: false,
  isError: true,
  errorMessage,
}));

export const getAllOrganizersPending = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.getAllOrganizersPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getAllOrganizersSuccess = createAction<
  IOrganizerStateContext,
  IOrganizer[]
>(OrganizerActionEnums.getAllOrganizersSuccess, (organizers: IOrganizer[]) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  organizers,
}));
export const getAllOrganizersError = createAction<
  IOrganizerStateContext,
  string
>(OrganizerActionEnums.getAllOrganizersError, (errorMessage: string) => ({
  isPending: false,
  isSuccess: false,
  isError: true,
  errorMessage,
}));

export const getOrganizerByIdPending = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.getOrganizerByIdPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getOrganizerByIdSuccess = createAction<
  IOrganizerStateContext,
  IOrganizer
>(OrganizerActionEnums.getOrganizerByIdSuccess, (organizer: IOrganizer) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  currentOrganizer: organizer,
}));
export const getOrganizerByIdError = createAction<
  IOrganizerStateContext,
  string
>(OrganizerActionEnums.getOrganizerByIdError, (errorMessage: string) => ({
  isPending: false,
  isSuccess: false,
  isError: true,
  errorMessage,
}));

export const getOrganizerByUserIdPending = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.getOrganizerByUserIdPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getOrganizerByUserIdSuccess = createAction<
  IOrganizerStateContext,
  IOrganizer
>(
  OrganizerActionEnums.getOrganizerByUserIdSuccess,
  (organizer: IOrganizer) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentOrganizer: organizer,
  })
);
export const getOrganizerByUserIdError = createAction<
  IOrganizerStateContext,
  string
>(OrganizerActionEnums.getOrganizerByUserIdError, (errorMessage: string) => ({
  isPending: false,
  isSuccess: false,
  isError: true,
  errorMessage,
}));

export const deleteOrganizerPending = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.deleteOrganizerPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const deleteOrganizerSuccess = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.deleteOrganizerSuccess,
  () => ({
    isPending: false,
    isSuccess: true,
    isError: false,
  })
);
export const deleteOrganizerError = createAction<
  IOrganizerStateContext,
  string
>(OrganizerActionEnums.deleteOrganizerError, (errorMessage: string) => ({
  isPending: false,
  isSuccess: false,
  isError: true,
  errorMessage,
}));

export const updateOrganizerPending = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.updateOrganizerPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const updateOrganizerSuccess = createAction<
  IOrganizerStateContext,
  IOrganizer
>(OrganizerActionEnums.updateOrganizerSuccess, (organizer: IOrganizer) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  currentOrganizer: organizer,
}));
export const updateOrganizerError = createAction<
  IOrganizerStateContext,
  string
>(OrganizerActionEnums.updateOrganizerError, (errorMessage: string) => ({
  isPending: false,
  isSuccess: false,
  isError: true,
  errorMessage,
}));

export const resetStateFlagsAction = createAction<IOrganizerStateContext>(
  OrganizerActionEnums.resetStateFlagsAction,
  () => ({ isPending: false, isSuccess: false, isError: false })
);
