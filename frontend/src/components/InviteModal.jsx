import { useEffect, useState, useCallback } from "react";
import { useChatContext } from "stream-chat-react";
import { XIcon, SearchIcon } from "lucide-react";
import FetchContentContainer from "./FetchContentContainer";
import toast from "react-hot-toast";

const InviteModal = ({ channel, onClose }) => {
  const { client } = useChatContext();

  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const fetchUsers = useCallback(
    async (pageParam = 0, search = "") => {
      setIsLoadingUsers(true);
      setError("");

      if (!client) return;

      try {
        const limit = 10;

        const members = Object.keys(channel.state.members);

        const filters = { id: { $nin: members } };

        if (search.trim()) {
          filters.$or = [
            { name: { $autocomplete: search.trim() } },
            { id: { $autocomplete: search.trim() } },
          ];
        }
        console.log("Channel members:", members);
        const response = await client.queryUsers(
          filters,
          { name: 1 },
          { limit, offset: pageParam * limit }
        );

        const usersOnly = response.users.filter(
          (user) => !user.id.startsWith("recording-")
        );
        // If it's the first page, replace users; otherwise append
        if (pageParam === 0) {
          setUsers(usersOnly);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...usersOnly]);
        }
        setHasMore(usersOnly.length === limit);
        setPage(pageParam + 1);
      } catch (error) {
        console.log("Error fetching users:", error);
        Sentry.captureException(error, {
          tags: { component: "InviteModal", function: "fetchUsers" },
          extra: { context: "fetch_users_for_invite" },
        });

        if (pageParam === 0) {
          setUsers([]);
        }

        setError("Error fetching users, please try again.");
      } finally {
        setIsLoadingUsers(false);
      }
    },
    [client, channel]
  );
  useEffect(() => {
    fetchUsers(0, debouncedSearchQuery);
  }, [fetchUsers, debouncedSearchQuery]);

  // debounce search input to avoid excessive calls
  useEffect(() => {
    // set a timeout to update the debounced search query
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    // cleanup function: clear the timeout if searchQuery changes before 500ms
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search input change (updates immediately for UI responsiveness)
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(0); // Reset to first page on new search
  };

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) {
      toast.warn("You've reached the end of the user list.");
      return;
    }
    await fetchUsers(page, debouncedSearchQuery);
  }, [hasMore, page, debouncedSearchQuery, fetchUsers]);

  const handleInvite = async () => {
    if (selectedMembers.length === 0) return;
    setIsInviting(true);
    setError("");
    try {
      await channel.addMembers(selectedMembers);
      toast.success(`Invited ${selectedMembers.length} user(s) successfully!`);
      onClose();
    } catch (error) {
      console.log("Error inviting users:", error);

      // Check if it's a permissions error
      if (
        error.message?.includes(
          "not allowed to perform action UpdateChannelMembers"
        )
      ) {
        setError(
          "You don't have permission to invite users to this channel. Only moderators can invite members."
        );
        toast.error(
          "Permission denied: Only channel moderators can invite members"
        );
      } else {
        setError("Error inviting users, please try again.");
        toast.error("Failed to invite users");
      }
    } finally {
      setIsInviting(false);
    }
  };
  return (
    <div className="create-channel-modal-overlay">
      <div className="create-channel-modal">
        <div className="create-channel-modal__header">
          {/* HEADER */}
          <h2 className>Invite Users</h2>

          <button onClick={onClose} className="create-channel-modal__close">
            <XIcon className="size-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="create-channel-modal__form">
          {/* Search Bar */}
          <div className="input-with-icon mb-3">
            <SearchIcon className="w-4 h-4 input-icon mx-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users by name..."
              className="form-input"
            />
          </div>
          {isLoadingUsers && (
            <FetchContentContainer
              isLoading={isLoadingUsers}
              message={"Loading Users..."}
            />
          )}
          {error && <p className="form-error">{error}</p>}
          {users.length == 0 && !isLoadingUsers && (
            <p>
              {debouncedSearchQuery
                ? "No users found matching your search"
                : "No users found"}
            </p>
          )}

          <div className="members-list">
            {users.length > 0 &&
              users.map((user) => {
                return (
                  <label key={user.id} className="member-item">
                    <input
                      type="checkbox"
                      className="member-checkbox"
                      value={user.id}
                      onChange={(event) => {
                        if (event.target.checked)
                          setSelectedMembers([...selectedMembers, user.id]);
                        else
                          setSelectedMembers(
                            selectedMembers.filter((id) => id !== user.id)
                          );
                      }}
                    />
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || user.id}
                        className="member-avatar"
                      />
                    ) : (
                      <div className="member-avatar-placeholder">
                        <span>
                          {(user.name || user.id).charAt(0).toUpperCase() ||
                            "?"}
                        </span>
                      </div>
                    )}
                    <span className="member-name text-black">
                      {user.name || user.id}
                    </span>
                  </label>
                );
              })}
          </div>

          {/* Load More Button */}
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingUsers || !hasMore}
            className="btn btn-secondary w-full mt-2"
          >
            {!hasMore
              ? "No more users available to load"
              : isLoadingUsers
              ? "Loading more..."
              : "Load More Users"}
          </button>

          {/* ACTIONS */}
          <div className="create-channel-modal__actions mt-4">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isInviting}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleInvite}
              disabled={!selectedMembers.length || isInviting}
            >
              {isInviting ? "Inviting..." : "Invite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
