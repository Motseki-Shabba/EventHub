import { handleActions } from "redux-actions";
import {
  INITIAL_STATE,
  ICommentStateContext,
  IComment,
} from "@/Providers/comments/context";
import { CommentActionEnums } from "@/Providers/comments/actions";

export const CommentReducer = handleActions<ICommentStateContext>(
  {
    // Handling create comment actions
    [CommentActionEnums.createCommentPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [CommentActionEnums.createCommentSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
      comments: state.comments
        ? [...state.comments, action.payload.currentComment].filter(
            (comment): comment is IComment => comment !== undefined
          )
        : [action.payload.currentComment].filter(
            (comment): comment is IComment => comment !== undefined
          ),
    }),
    [CommentActionEnums.createCommentError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling get event comments actions
    [CommentActionEnums.getEventCommentsPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [CommentActionEnums.getEventCommentsSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [CommentActionEnums.getEventCommentsError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling received comment from SignalR
    [CommentActionEnums.addReceivedComment]: (state, action) => {
      // Only add if it's not already in the list (avoid duplicates)
      const commentExists = state.comments?.some(
        (comment) => comment.id === action.payload.receivedComment?.id
      );

      return {
        ...state,
        ...action.payload,
        comments:
          commentExists || !action.payload.receivedComment
            ? state.comments
            : [...(state.comments || []), action.payload.receivedComment],
      };
    },

    // Handling reset state flags action
    [CommentActionEnums.resetStateFlagsAction]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
