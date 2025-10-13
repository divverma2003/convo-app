import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { useChatContext } from "stream-chat-react";
import toast from "react-hot-toast";

import * as Sentry from "@sentry/react";
import { CircleIcon } from "lucide-react";
import FetchContentContainer from "./FetchContentContainer.jsx";
import ErrorMessageContainer from "./ErrorMessageContainer.jsx";

const UsersList = ({ activeChannel }) => {
  const { client } = useChatContext();
  // we won't use the search params, but we need the setter to change the URL
  const [_, setSearchParams] = useSearchParams();

  const fetchUsers = useCallback(
    async (pageParam = 0) => {
      if (!client?.user) return { users: [], hasMore: false };

      const limit = 10;
      const response = await client.queryUsers(
        { id: { $ne: client.user.id } },
        { name: 1 },
        // - limit: how many users to fetch
        // - offset: skip this many users (for pagination)
        //   Example: pageParam=0 → offset=0 (first 10 users)
        //            pageParam=1 → offset=10 (next 10 users)
        //            pageParam=2 → offset=20 (next 10 users)
        { limit, offset: limit * pageParam }
      );

      // Filter out system users (recording bots, etc.)

      const usersOnly = response.users.filter(
        (user) => !user.id.startsWith("recording-")
      );
      return {
        usersOnly,
        hasMore: usersOnly.length === limit,
        nextPage: pageParam + 1,
      };
    },
    [client]
  );

  const {
    // Contains all fetched pages: { pages: [{usersOnly: [...], hasMore: true, nextPage: 1}, ...] }

    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users-list", client?.user?.id],
    queryFn: ({ pageParam = 0 }) => fetchUsers(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    // convert client to boolean to avoid issues with object reference
    // only run the query if there's a user
    enabled: !!client?.user,
    // staleTime: data is considered fresh for 5 minutes (before it's refreshed)
    staleTime: 1000 * 60 * 5, // 5 minutes

    // Number of times to retry failed requests before giving up
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("Error fetching users:", error);
      Sentry.captureException(error, {
        tags: { component: "UsersList" },
        extra: { context: "fetch_users_list" },
      });
    },
  });

  // Flatten all pages into a single users array
  const users = data?.pages.flatMap((page) => page.usersOnly) ?? [];

  const startDirectMessage = async (targetUser) => {
    if (!targetUser || !client?.user) return;

    try {
      // stream id is max 64 characters
      const channelId = [client.user.id, targetUser.id]
        .sort()
        .join("-")
        .slice(0, 64);
      const channel = client.channel("messaging", channelId, {
        members: [client.user.id, targetUser.id],
      });
      await channel.watch();
      setSearchParams({ channel: channelId });
    } catch (error) {
      console.log("Error creating Direct Message", error),
        Sentry.captureException(error, {
          tags: { component: "UsersList" },
          extra: {
            context: "create_direct_message",
            targetUserId: targetUser?.id,
          },
        });
    }
  };

  // Handle loading more users with toast notification
  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage) {
      toast.warn("You've reached the end of the users list");
      return;
    }

    await fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  if (isError) return <ErrorMessageContainer message="Something went wrong!" />;
  if (isLoading)
    return (
      <FetchContentContainer
        isLoading={isLoading}
        message={"Loading Users..."}
      />
    );

  if (!users.length)
    return <div className="team-channel-list__message">No users found.</div>;
  return (
    <div className="team-channel-list__users">
      {users.map((user) => {
        // create a channel id based on both user ids (sorted to ensure consistency)
        const channelId = [client.user.id, user.id]
          .sort()
          .join("-")
          .slice(0, 64);

        const isActive = activeChannel && activeChannel.id === channelId;

        let unreadCount = 0;

        try {
          const channel = client.channel("messaging", channelId, {
            members: [client.user.id, user.id],
          });
          unreadCount = channel.countUnread();
        } catch (error) {
          console.error("Error counting unread:", error);
        }

        const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "?";
        return (
          <button
            key={user.id}
            onClick={() => startDirectMessage(user)}
            className={`str-chat__channel-preview-messenger ${
              isActive
                ? "!bg-yellow-900/25 !hover:bg-yellow-900/25 border-l-8 border-yellow-900 shadow-lg0"
                : ""
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.id}
                    className="w-6.5 h-6.5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6.5 h-6.5 rounded-full bg-pink-300/70 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {userInitial}
                    </span>
                  </div>
                )}

                <CircleIcon
                  className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 ${
                    user.online
                      ? "text-green-700 fill-green-700"
                      : "text-gray-300 fill-gray-300"
                  }`}
                />
              </div>

              <span className="str-chat__channel-preview-messager-name truncate">
                {user.name || user.id}
              </span>

              {unreadCount > 0 && (
                <span className="flex items-center justify-center ml-2 size-4.5 text-xs rounded-full bg-red-600">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </button>
        );
      })}

      {hasNextPage && (
        <button
          onClick={() => handleLoadMore()}
          disabled={isFetchingNextPage}
          className="w-full btn btn-primary"
        >
          {isFetchingNextPage ? "Loading more users..." : "Load More"}
        </button>
      )}
    </div>
  );
};
export default UsersList;
