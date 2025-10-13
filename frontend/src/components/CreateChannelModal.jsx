import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useChatContext } from "stream-chat-react";
import * as Sentry from "@sentry/react";
import toast from "react-hot-toast";
import {
  AlertCircleIcon,
  HashIcon,
  LockIcon,
  UsersIcon,
  XIcon,
  SearchIcon,
} from "lucide-react";

const CreateChannelModal = ({ onClose }) => {
  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState("public"); // public or private
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]); // array of user IDs
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [_, setSearchParams] = useSearchParams();

  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const { client, setActiveChannel } = useChatContext();

  // debounce search input to avoid excessive calls
  useEffect(() => {
    // set a timeout to update the debounced search query
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    // cleanup function: clear the timeout if searchQuery changes before 500ms
    return () => clearTimeout(timer);
  }, [searchQuery]);
  // fetch users to add to the channel
  const fetchUsers = useCallback(
    async (pageParam = 0, search = "") => {
      if (!client) return;
      setLoadingUsers(true);

      try {
        const limit = 25;

        const filters = {
          id: { $ne: client.user.id },
        };

        if (search.trim()) {
          // search by name or id using q
          filters.$or = [
            { name: { $autocomplete: search.trim() } },
            { id: { $autocomplete: search.trim() } },
          ];
        }

        // filter out the current user and any bot users (like recording-*)
        // sort in alphabetical order by name
        // limit to 100 users for performance
        const response = await client.queryUsers(
          filters,
          { name: 1 },
          { limit, offset: limit * pageParam }
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
        console.log("Error fetching users: ", error);
        Sentry.captureException(error, {
          tags: { component: "CreateChannelModal" },
          extra: { context: "fetch_users_for_channel" },
        });

        if (pageParam === 0) {
          setUsers([]);
        }
      } finally {
        setLoadingUsers(false);
      }
    },
    [client]
  );

  // initial fetch
  useEffect(() => {
    fetchUsers(0, debouncedSearchQuery);
  }, [fetchUsers, debouncedSearchQuery]);

  // auto-select all users for public channels
  useEffect(() => {
    if (channelType === "public") setSelectedMembers(users.map((u) => u.id));
    else setSelectedMembers([]);
  }, [channelType, users]);

  const validateChannelName = (name) => {
    if (!name.trim()) return "Channel name cannot be empty";
    if (name.length < 3 || name.length > 22)
      return "Channel name must be between 3 and 22 characters";

    return "";
  };

  // confirms that the channel name is valid as the user types
  const handleChannelNameChange = (event) => {
    const value = event.target.value;
    setChannelName(value);
    setError(validateChannelName(value));
  };

  const handleMemberToggle = (id) => {
    if (selectedMembers.includes(id)) {
      // filter out the id (user)
      setSelectedMembers(selectedMembers.filter((userId) => userId !== id));
    } else {
      // add the user
      setSelectedMembers([...selectedMembers, id]);
    }
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validateError = validateChannelName(channelName);
    if (validateError) return setError(validateError);

    if (isCreating || !client?.user) return;

    setIsCreating(true);
    setError(null);

    try {
      // enforce a channel ID format
      // replace spaces with dashes, remove special characters, limit to 22 chars
      const channelId = channelName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .slice(0, 22);

      // prepare the channel data
      const channelData = {
        name: channelName.trim(),
        created_by_id: client.user.id,
        members: [client.user.id, ...selectedMembers],
      };

      // If description is provided, add it
      if (description.trim()) channelData.description = description.trim();

      if (channelType === "private") {
        channelData.private = true;
        channelData.visibility = "private";
      } else {
        channelData.discoverable = true;
        channelData.visibility = "public"; // custom field
      }

      // create the channel
      const channel = client.channel("messaging", channelId, channelData);

      // load and watch the channel for updates
      await channel.watch();

      setActiveChannel(channel);
      setSearchParams({ channel: channelId });

      toast.success(`Channel #${channelName} created successfully!`);

      // close the modal by calling the onClose prop (automatically after channel creation)
      onClose();
    } catch (error) {
      console.log("Error creating channel: ", error);
      Sentry.captureException(error, {
        tags: { component: "CreateChannelModal" },
        extra: { context: "create_channel" },
      });
      toast.error("Error creating channel. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-channel-modal-overlay">
      <div className="create-channel-modal">
        <div className="create-channel-modal__header">
          <h2>Create a Channel</h2>
          <button onClick={onClose} className="create-channel-modal__close">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="create-channel-modal__form">
          {error && (
            <div className="form-error">
              <AlertCircleIcon className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* channel name */}
          <div className="form-group">
            <div className="input-with-icon">
              <HashIcon className="w-4 h-4 input-icon" />
              <input
                id="channelName"
                type="text"
                value={channelName}
                onChange={handleChannelNameChange}
                placeholder="e.g. introductions"
                className={`form-input ${error ? "form-input--error" : ""}`}
                autoFocus
                maxLength={22}
              />
            </div>

            {/* channel id preview */}
            {/* Clientside validation */}
            {channelName && (
              <div className="form-hint">
                Channel ID will be: #
                {channelName
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-_]/g, "")}
              </div>
            )}
          </div>

          {/* CHANNEL TYPE */}
          <div className="form-group">
            <label>Channel Type</label>

            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  value="public"
                  checked={channelType === "public"}
                  onChange={(event) => setChannelType(event.target.value)}
                />
                <div className="radio-content">
                  <HashIcon className="size-4" />
                  <div>
                    <div className="radio-title">Public</div>
                    <div className="radio-description">
                      Anyone can join this channel
                    </div>
                  </div>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  value="private"
                  checked={channelType === "private"}
                  onChange={(event) => setChannelType(event.target.value)}
                />

                <div className="radio-content">
                  <LockIcon className="size-4" />
                  <div>
                    <div className="radio-title">Private</div>
                    <div className="radio-description">
                      Only invited users can join this channel
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* add members component */}
          {/* only show when creating a private channel */}
          {channelType === "private" && (
            <div className="form-group">
              <label>Add Members</label>
              {/* Search Bar */}
              <div className="input-with-icon mb-3">
                <SearchIcon className="w-4 h-4 input-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search users by name..."
                  className="form-input"
                />
              </div>
              <div className="member-selection-header">
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() =>
                    selectedMembers.length === users.length
                      ? setSelectedMembers([])
                      : setSelectedMembers(users.map((user) => user.id))
                  }
                  disabled={loadingUsers || users.length === 0}
                >
                  <UsersIcon className="w-4 h-4" />
                  Select Everyone
                </button>
                <span className="selected-count">{selectedMembers.length}</span>
              </div>

              <div className="members-list">
                {loadingUsers && page == 0 ? (
                  <p>Loading users...</p>
                ) : users.length === 0 ? (
                  <p>
                    {debouncedSearchQuery
                      ? "No users found matching your search"
                      : "No users found"}
                  </p>
                ) : (
                  users.map((user) => (
                    <label key={user.id} className="member-item">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user.id)}
                        onChange={() => handleMemberToggle(user.id)}
                        className="member-checkbox"
                      />
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || user.id}
                          className="member-avatar"
                        />
                      ) : (
                        <div className="member-avatar-placeholder">
                          {/* Placeholder avatar with initials */}
                          <span>
                            {(user.name || user.id).charAt(0).toUpperCase() ||
                              ""}
                          </span>
                        </div>
                      )}
                      <span className="member-name">
                        {user.name || user.id}
                      </span>
                    </label>
                  ))
                )}
                {/* Load More Button */}
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingUsers || !hasMore}
                  className="btn btn-secondary w-full mt-2"
                >
                  {loadingUsers ? "Loading more..." : "Load More Users"}
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description (optional) </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A description for this channel."
              className="form-textarea"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="create-channel-modal__actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!channelName.trim() || isCreating}
              className="btn-primary btn"
            >
              {isCreating ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;
