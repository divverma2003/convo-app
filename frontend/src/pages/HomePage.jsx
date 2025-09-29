import { useState, useEffect } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useStreamChat } from "../hooks/useStreamChat.js";
import { useSearchParams } from "react-router";
import PageLoader from "../components/PageLoader.jsx";
import "../styles/stream-chat-theme.css";
const HomePage = () => {
  const { chatClient, error, isLoading } = useStreamChat();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // upon chat client initialization/update, check if there's a channel in the URL params

  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel"); // where channel is the key in the URL
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId); // channels such as team are also available
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  // todo: handle this with a better component
  if (error) return <p>Something went wrong!</p>;
  if (isLoading || !chatClient) return <PageLoader />;
  return (
    <div>
      <UserButton />
      Home Page
    </div>
  );
};

export default HomePage;
