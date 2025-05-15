import { createAction } from "redux-actions";
import {
  IComment,
  ICommentStateContext,
  ICreateCommentResponse,
} from "@/Providers/comments/context";

export enum CommentActionEnums {
  createCommentPending = "CREATE_COMMENT_PENDING",
  createCommentSuccess = "CREATE_COMMENT_SUCCESS",
  createCommentError = "CREATE_COMMENT_ERROR",

  getEventCommentsPending = "GET_EVENT_COMMENTS_PENDING",
  getEventCommentsSuccess = "GET_EVENT_COMMENTS_SUCCESS",
  getEventCommentsError = "GET_EVENT_COMMENTS_ERROR",

  addReceivedComment = "ADD_RECEIVED_COMMENT",

  resetStateFlagsAction = "RESET_COMMENT_STATE_FLAGS",
}

export const createCommentPending = createAction<ICommentStateContext>(
  CommentActionEnums.createCommentPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const createCommentSuccess = createAction<
  ICommentStateContext,
  ICreateCommentResponse
>(
  CommentActionEnums.createCommentSuccess,
  (response: ICreateCommentResponse) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentComment: response,
  })
);
export const createCommentError = createAction<ICommentStateContext, string>(
  CommentActionEnums.createCommentError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const getEventCommentsPending = createAction<ICommentStateContext>(
  CommentActionEnums.getEventCommentsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getEventCommentsSuccess = createAction<
  ICommentStateContext,
  IComment[]
>(CommentActionEnums.getEventCommentsSuccess, (comments: IComment[]) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  comments,
}));
export const getEventCommentsError = createAction<ICommentStateContext, string>(
  CommentActionEnums.getEventCommentsError,
  (errorMessage: string) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage,
  })
);

export const addReceivedComment = createAction<ICommentStateContext, IComment>(
  CommentActionEnums.addReceivedComment,
  (comment: IComment) => ({
    isPending: false,
    isSuccess: false,
    isError: false,
    receivedComment: comment,
  })
);

export const resetStateFlagsAction = createAction<ICommentStateContext>(
  CommentActionEnums.resetStateFlagsAction,
  () => ({ isPending: false, isSuccess: false, isError: false })
);
