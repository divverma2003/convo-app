import { useState, useEffect } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useStreamChat } from "../hooks/useStreamChat.js";
import { useSearchParams } from "react-router";

import ErrorMessageContainer from "../components/ErrorMessageContainer.jsx";
import FetchMessageContainer from "../components/FetchMessageContainer.jsx";
import CustomChannelHeader from "../components/CustomChannelHeader.jsx";
import CustomChannelPreview from "../components/CustomChannelPreview.jsx";
import CustomChannelModal from "../components/CustomChannelModal.jsx";
import UsersList from "../components/UsersList.jsx";
import { HashIcon, PlusIcon, UsersIcon } from "lucide-react";

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
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
  if (error) return <ErrorMessageContainer message="Something went wrong!" />;
  if (isLoading || !chatClient) return <PageLoader />;
  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">
          {/*LEFT SIDEBAR */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              {/*HEADER*/}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img
                    src="/logo.png"
                    alt="Convo Logo"
                    className="brand-logo"
                  />
                  <span className="brand-name">Convo</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>
              {/*CHANNELS LIST */}
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button
                    className="create-channel-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <PlusIcon className="size-4" />
                    <span>Create Channel</span>
                  </button>
                </div>
                {/*CHANNEL LIST */}
                <ChannelList
                  filters={{ members: { $in: [chatClient?.user?.id] } }}
                  options={{ state: true, watch: true }}
                  Preview={({ channel }) => <CustomChannelPreview />}
                  List={({ children, loading, error }) => (
                    <div className="channel-sections">
                      <div className="section-header">
                        <div className="section-title">
                          <HashIcon className="size-4" />
                          <span>Channels</span>
                        </div>
                      </div>

                      {loading && (
                        <FetchMessageContainer
                          isLoading={loading}
                          message={"Loading channels..."}
                        />
                      )}
                      {error && (
                        <ErrorMessageContainer
                          message={"Error loading channels."}
                        />
                      )}
                      <div className="channels-list">{children}</div>

                      <div className="section-header direct-messages">
                        <div className="section-title">
                          <UsersIcon className="size-4" />
                          <span>Direct Messages</span>
                        </div>
                      </div>
                      <UsersList activeChannel={activeChannel} />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/*RIGHT CONTAINER */}
        <div className="chat-main">
          <Channel channel={activeChannel}>
            <Window>
              <CustomChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>

            {/* threaded messages */}
            <Thread />
          </Channel>
        </div>

        {isCreateModalOpen && (
          <CustomChannelModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </Chat>
    </div>
  );
};

export default HomePage;
