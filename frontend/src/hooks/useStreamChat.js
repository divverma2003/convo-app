import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import * as Sentry from "@sentry/react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// this hook is responsible for initializing and returning the Stream chat client
// it connects the user to the chat client (STREAM API)
// allowing them to send, view, and receive messages
// these messages are fetched in real time
// upon signing out, the user is disconnected from the chat client
// and the chat client is cleaned up for performance (and to prevent the user from being "online" when they are not)
export const useStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);

  // fetch stream token using react query
  const {
    data: tokenData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["streamToken", user?.id], // refetch if user changes (login/logout)
    queryFn: getStreamToken, // Fetch the token from your backend (function defined above)
    enabled: !!user?.id, // Only run this query if the user is available -- logged out user have no token
  });

  // initialize stream chat client when we have a user and a token
  useEffect(() => {
    // check if we have user and token

    if (!tokenData?.token || !user?.id || !STREAM_API_KEY) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);
    let cancelled = false; // prevent setting state if component unmounts

    const initializeChat = async () => {
      try {
        // connect the user to the chat client (for this project, user id is the clerk user id)
        await client.connectUser(
          {
            id: user.id,
            name:
              user.fullName ??
              user.username ??
              user.primaryEmailAddress?.emailAddress ??
              user.id,
            image: user.imageUrl ?? undefined,
          },
          tokenData.token
        );
        // set the chat client in state
        if (!cancelled) setChatClient(client);
      } catch (error) {
        console.error("Error initializing Stream chat client:", error);

        Sentry.captureException(error, {
          tags: { component: "useStreamChat" },
          extra: {
            context: "stream_chat_connection",
            userId: user?.id,
            streamApiKey: STREAM_API_KEY ? "present" : "missing",
          },
        });
      }
    };
    initializeChat();
    // cleanup
    return () => {
      cancelled = true;
      if (chatClient) chatClient.disconnectUser();
    };
  }, [user?.id, tokenData?.token]);

  return { chatClient, isLoading, error };
};
