import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

import { getStreamToken } from "../lib/api";
import PageLoader from "../components/PageLoader";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  // get callId from the URL (from APP router)
  const { id: callId } = useParams();
  const { user, isLoaded } = useUser();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callError, setCallError] = useState(null);
  // fetch stream token for the current user
  // from the backend
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user, // convert to boolean
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !user || !callId) return;

      try {
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: user.id,
            name: user.fullName,
            image: user.imageUrl,
          },
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        // upsert call
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.log("Error initializing call:", error);
        setCallError(error);
        toast.error("Error starting call, please try again.");
      } finally {
        setIsConnecting(false);
      }
    };
    initCall();
  }, [tokenData, user, callId]);

  if (isConnecting || !isLoaded) {
    return <PageLoader message="Connecting to call..." />;
  }

  if (callError) {
    return (
      <ErrorMessageContainer message="Error initializing call, please try again later." />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-900">
      <div className="brand-container">
        <img src="/logo.png" alt="Convo Logo" className="brand-logo" />
        <span className="brand-name">Convo</span>
      </div>
      <div className="relative w-full max-w-4xl mx-auto">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <ErrorMessageContainer message="Error joining call, please try again later." />
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // if call has ended or user has left, navigate back to home page
  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
