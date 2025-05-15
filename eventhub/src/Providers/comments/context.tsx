"use client";

import { createContext } from "react";

export interface IComment {
  id?: string;
  text: string;
  eventId: string;
  userId: number;
  userName: string;
  creationTime: string | Date;
}

export interface ICreateCommentRequest {
  text: string;
  eventId: string;
}

export interface ICreateCommentResponse {
  id: string;
  text: string;
  eventId: string;
  userId: number;
  userName: string;
  creationTime: string | Date;
}

export interface ICommentStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  comments?: IComment[];
  currentComment?: IComment;
  receivedComment?: IComment;
  errorMessage?: string;
}

export interface ICommentActionContext {
  createComment: (
    comment: ICreateCommentRequest
  ) => Promise<ICreateCommentResponse>;
  getEventComments: (eventId: string) => Promise<void>;
  setupSignalRConnection: (eventId: string) => Promise<void>;
  disconnectSignalR: () => void;
  resetStateFlags: () => void;
}

export const INITIAL_STATE: ICommentStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  comments: [],
  currentComment: undefined,
  receivedComment: undefined,
  errorMessage: undefined,
};

export const CommentStateContext =
  createContext<ICommentStateContext>(INITIAL_STATE);

export const CommentActionContext = createContext<ICommentActionContext>({
  createComment: async () => {
    return {} as ICreateCommentResponse;
  },
  getEventComments: async () => {},
  setupSignalRConnection: async () => {},
  disconnectSignalR: () => {},
  resetStateFlags: () => {},
});
