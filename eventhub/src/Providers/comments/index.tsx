"use client";
import { getAxiosInstace } from "@/Utils/axios-instance";
import { useContext, useReducer, useRef, useEffect } from "react";
import {
  createCommentError,
  createCommentPending,
  createCommentSuccess,
  getEventCommentsError,
  getEventCommentsPending,
  getEventCommentsSuccess,
  addReceivedComment,
  resetStateFlagsAction,
} from "@/Providers/comments/actions";
import {
  CommentActionContext,
  CommentStateContext,
  IComment,
  ICreateCommentRequest,
  ICreateCommentResponse,
  INITIAL_STATE,
} from "@/Providers/comments/context";
import { CommentReducer } from "@/Providers/comments/reducer";
import * as signalR from "@microsoft/signalr";

export const CommentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(CommentReducer, INITIAL_STATE);
  const instance = getAxiosInstace();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // Cleanup SignalR connection on unmount
  useEffect(() => {
    return () => {
      disconnectSignalR();
    };
  }, []);

  const createComment = async (
    request: ICreateCommentRequest
  ): Promise<ICreateCommentResponse> => {
    dispatch(createCommentPending());
    const endpoint = `/api/services/app/Comment/CreateComment`;

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await instance.post(endpoint, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        const result = response.data.result as ICreateCommentResponse;
        dispatch(createCommentSuccess(result));
        return result;
      } else {
        throw new Error("Failed to create comment");
      }
    } catch (error) {
      const backendMessage =
        error instanceof Error ? error.message : "Failed to create comment";
      dispatch(createCommentError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const getEventComments = async (eventId: string) => {
    dispatch(getEventCommentsPending());
    const endpoint = `/api/services/app/Comment/GetEventComments?eventId=${eventId}`;

    try {
      const response = await instance.get(endpoint);

      if (response.status === 200 && response.data) {
        dispatch(getEventCommentsSuccess(response.data.result));
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      const backendMessage =
        error instanceof Error ? error.message : "Failed to fetch comments";
      dispatch(getEventCommentsError(backendMessage));
      throw new Error(backendMessage);
    }
  };

  const setupSignalRConnection = async (eventId: string) => {
    try {
      // Disconnect any existing connection
      disconnectSignalR();

      // Create a new connection
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("/eventcommenthub", {
          accessTokenFactory: () => sessionStorage.getItem("accessToken") || "",
        })
        .withAutomaticReconnect()
        .build();

      // Set up event handlers
      connection.on("ReceiveComment", (comment: IComment) => {
        dispatch(addReceivedComment(comment));
      });

      // Start the connection
      await connection.start();
      console.log("SignalR connected");

      // Join the event group
      await connection.invoke("JoinEventGroup", eventId);
      console.log(`Joined event group: ${eventId}`);

      // Store the connection
      connectionRef.current = connection;
    } catch (error) {
      console.error("SignalR connection error:", error);
    }
  };

  const disconnectSignalR = () => {
    if (connectionRef.current) {
      connectionRef.current.stop();
      connectionRef.current = null;
      console.log("SignalR disconnected");
    }
  };

  const resetStateFlags = () => {
    dispatch(resetStateFlagsAction());
  };

  return (
    <CommentStateContext.Provider value={state}>
      <CommentActionContext.Provider
        value={{
          createComment,
          getEventComments,
          setupSignalRConnection,
          disconnectSignalR,
          resetStateFlags,
        }}
      >
        {children}
      </CommentActionContext.Provider>
    </CommentStateContext.Provider>
  );
};

export const useCommentState = () => {
  const context = useContext(CommentStateContext);
  if (!context) {
    throw new Error("useCommentState must be used within a CommentProvider");
  }
  return context;
};

export const useCommentActions = () => {
  const context = useContext(CommentActionContext);
  if (!context) {
    throw new Error("useCommentActions must be used within a CommentProvider");
  }
  return context;
};
