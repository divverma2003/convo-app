import { HashIcon } from "lucide-react";

const CustomChannelPreview = ({ channel, setActiveChannel, activeChannel }) => {
  // active channels are highlighted in the list
  const isActive = activeChannel && activeChannel.id === channel.id;

  // determine if the channel is a direct message, group differently
  // direct messages will not be shown in the channel list
  // only channels with more than 2 members or non-DM channels will be shown
  // this is determined by checking the member count and the channel id pattern
  const isDM =
    (channel.data.member_count === 2 && channel.data.id.includes("user_")) ||
    channel.data.isDM === true;

  if (isDM) return null;

  const unreadCount = channel.state.unreadCount || 0;

  return (
    <button
      onClick={() => setActiveChannel(channel)}
      className={`str-chat__channel-preview-messenger transition-colors flex items-center w-full text-left px-4 py-2 rounded-lg mb-1 font-medium hover:bg-blue-50/80 min-h-9 ${
        isActive
          ? "!bg-yellow-900/25 !hover:bg-yellow-900/25 border-l-8 border-yellow-900 shadow-lg text-white"
          : ""
      }`}
    >
      <HashIcon className="w-4 h-4 text-[#9b9b9b] mr-2" />
      <span className="str-chat__channel-preview-messenger-name flex-1">
        {channel.data.id}
      </span>

      {unreadCount > 0 && (
        <span className="flex items-center justify-center ml-2 size-4 text-xs rounded-full bg-red-600">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default CustomChannelPreview;
