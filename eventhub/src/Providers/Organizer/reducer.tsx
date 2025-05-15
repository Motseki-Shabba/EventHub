import { handleActions } from "redux-actions";
import {
  INITIAL_STATE,
  IOrganizerStateContext,
} from "@/Providers/Organizer/context";
import { OrganizerActionEnums } from "@/Providers/Organizer/actions";

export const OrganizerReducer = handleActions<IOrganizerStateContext>(
  {
    // Handling create organizer actions
    [OrganizerActionEnums.createOrganizerPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.createOrganizerSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.createOrganizerError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling get all organizers actions
    [OrganizerActionEnums.getAllOrganizersPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.getAllOrganizersSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.getAllOrganizersError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling get organizer by id actions
    [OrganizerActionEnums.getOrganizerByIdPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.getOrganizerByIdSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.getOrganizerByIdError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling get organizer by user id actions
    [OrganizerActionEnums.getOrganizerByUserIdPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.getOrganizerByUserIdSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.getOrganizerByUserIdError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling delete organizer actions
    [OrganizerActionEnums.deleteOrganizerPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.deleteOrganizerSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.deleteOrganizerError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling update organizer actions
    [OrganizerActionEnums.updateOrganizerPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.updateOrganizerSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OrganizerActionEnums.updateOrganizerError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling reset state flags action
    [OrganizerActionEnums.resetStateFlagsAction]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
