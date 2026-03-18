import { useAuth } from "@/Context/useAuth";
import { adminService, type ApiUser } from "@/services/admin.service";
import type { Conversation, Message } from "@/types/chat.types";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  MapPin,
  MessageCircle,
  Paperclip,
  Search,
  Send,
  Smile,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/InboxPage.css";
import Notification from "@/shared/components/Notification";
import { useChatStore, useNotification } from "@/shared/hooks";

import { config } from "@/core/config";

const getRoleName = (role: ApiUser["role"]): string => {
  if (typeof role === "string") return role;
  if (typeof role === "object" && role && "name" in role)
    return (role as { name?: string }).name || "User";
  return "User";
};

const getProfilePicUrl = (user: ApiUser): string | undefined => {
  const pic = user.personalInfo?.profilePicture;
  if (!pic) return undefined;

  if (typeof pic === "string" && pic.trim()) return pic;

  if (typeof pic === "object") {
    const p = pic as { url?: string; filename?: string };
    if (p.url && p.url.trim()) return p.url;
    if (p.filename && p.filename.trim())
      return `${config.storage.baseUrl}/${p.filename}`;
  }

  return undefined;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 7) return days[d.getDay()];
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const formatDayLabel = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "YESTERDAY";
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const UserAvatar = ({
  user,
  size = 38,
  showBorder = true,
}: {
  user: ApiUser;
  size?: number;
  showBorder?: boolean;
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const url = getProfilePicUrl(user);

  const borderStyle = showBorder
    ? { border: "2px solid var(--border-base)" }
    : { border: "3px solid var(--color-brand-primary)" };

  if (url && !imgFailed) {
    return (
      <img
        src={url}
        alt={user.fullName}
        onError={() => setImgFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          display: "block",
          ...borderStyle,
        }}
      />
    );
  }

  const colors = [
    "#2e7d52",
    "#1565c0",
    "#6a1b9a",
    "#ad1457",
    "#e65100",
    "#2e7d32",
    "#00695c",
    "#37474f",
    "#558b2f",
    "#4527a0",
  ];
  const colorIdx =
    user.fullName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    colors.length;
  const bg = colors[colorIdx];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "0.02em",
        ...borderStyle,
      }}
    >
      {getInitials(user.fullName || "U")}
    </div>
  );
};

const InboxPage = () => {
  const { user: authUser, logout } = useAuth();
  const { notification, showError, hideNotification } = useNotification();
  const currentUserId = authUser?._id || "";

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [convUserMap, setConvUserMap] = useState<Map<string, ApiUser>>(
    new Map(),
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ApiUser[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searching, setSearching] = useState(false);

  const [activeUser, setActiveUser] = useState<ApiUser | null>(null);

  const [inputText, setInputText] = useState("");
  const [groupMemberUserId, setGroupMemberUserId] = useState("");
  const [groupMemberRole, setGroupMemberRole] = useState<"member" | "admin">(
    "member",
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    conversations,
    activeConversationId,
    messagesByConversationId,
    typingByConversationId,
    connectionStatus,
    loadingConversations,
    setActiveConversation,
    openDirectConversation,
    sendTextMessage,
    setTyping,
    markRead,
    addGroupMember,
    removeGroupMember,
    loadConversations,
  } = useChatStore({
    currentUserId,
    onUnauthorized: logout,
    onError: showError,
  });

  const messages = useMemo(
    () =>
      activeConversationId
        ? messagesByConversationId[activeConversationId] || []
        : [],
    [activeConversationId, messagesByConversationId],
  );

  useEffect(() => {
    if (!currentUserId) return;

    const participantIds = [
      ...new Set(
        conversations
          .flatMap((conversation) =>
            conversation.members
              .map((member) => member.userId || member.user?._id)
              .filter((id): id is string => !!id && id !== currentUserId),
          )
          .filter(Boolean),
      ),
    ];

    if (participantIds.length === 0) return;

    (async () => {
      try {
        const resp = await adminService.getAllUsers(1, 20);
        const map = new Map<string, ApiUser>();
        resp.data.forEach((u) => {
          if (participantIds.includes(u._id)) {
            map.set(u._id, u);
          }
        });
        setConvUserMap(map);
      } catch (err) {
        console.error("Failed to load conversation participants:", err);
      }
    })();
  }, [conversations, currentUserId]);

  const doSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSearchTotal(0);
        setSearching(false);
        return;
      }
      setSearching(true);
      try {
        const resp = await adminService.getAllUsers(1, 20);
        const normalizedQuery = query.trim().toLowerCase();

        const filtered = resp.data
          .filter((u) => u._id !== currentUserId)
          .filter((u) => {
            const name = (u.fullName || "").toLowerCase();
            const email = (u.email || "").toLowerCase();
            const address = (u.address || "").toLowerCase();
            return (
              name.includes(normalizedQuery) ||
              email.includes(normalizedQuery) ||
              address.includes(normalizedQuery)
            );
          });

        setSearchResults(filtered.slice(0, 20));
        setSearchTotal(filtered.length);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    },
    [currentUserId],
  );

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchTotal(0);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchDebounceRef.current = setTimeout(() => {
      doSearch(searchQuery);
    }, 350);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery, doSearch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeConversationId || !currentUserId) return;

    const unreadIncomingIds = messages
      .filter(
        (message) =>
          message.senderId !== currentUserId &&
          !(Array.isArray(message.readBy) ? message.readBy : []).includes(
            currentUserId,
          ),
      )
      .map((message) => message._id);

    if (unreadIncomingIds.length > 0) {
      markRead(unreadIncomingIds);
    }
  }, [activeConversationId, currentUserId, markRead, messages]);

  const openConversation = async (otherUser: ApiUser) => {
    if (!currentUserId) return;
    await openDirectConversation(otherUser._id);
    setActiveUser(otherUser);
    setConvUserMap((prev) => {
      const next = new Map(prev);
      next.set(otherUser._id, otherUser);
      return next;
    });
    setSearchQuery("");
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !activeConversationId || !currentUserId) return;
    await sendTextMessage(inputText);
    setTyping(false);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupMessagesByDay = (msgs: Message[]) => {
    const groups: { label: string; msgs: Message[] }[] = [];
    let lastDay = "";
    for (const m of msgs) {
      const day = new Date(m.createdAt).toDateString();
      if (day !== lastDay) {
        groups.push({ label: formatDayLabel(m.createdAt), msgs: [] });
        lastDay = day;
      }
      groups[groups.length - 1].msgs.push(m);
    }
    return groups;
  };

  const messageGroups = groupMessagesByDay(messages);
  const isSearching = searchQuery.trim().length > 0;
  const currentConversation = conversations.find(
    (conversation) => conversation._id === activeConversationId,
  );

  const activeTypingUserIds = activeConversationId
    ? typingByConversationId[activeConversationId] || []
    : [];

  const activeTypingNames = activeTypingUserIds
    .filter((userId) => userId !== currentUserId)
    .map((userId) => convUserMap.get(userId)?.fullName || "Someone");

  const getOtherUserId = (conversation: Conversation) => {
    const otherMember = conversation.members.find(
      (member) => (member.userId || member.user?._id) !== currentUserId,
    );
    return otherMember?.userId || otherMember?.user?._id || "";
  };

  const selectConversation = async (conversation: Conversation) => {
    await setActiveConversation(conversation._id);

    if (conversation.type === "group") {
      setActiveUser(null);
      return;
    }

    const otherUserId = getOtherUserId(conversation);
    if (!otherUserId) {
      setActiveUser(null);
      return;
    }

    const existing = convUserMap.get(otherUserId);
    if (existing) {
      setActiveUser(existing);
      return;
    }

    try {
      const users = await adminService.getAllUsers(1, 20);
      const matched = users.data.find((u) => u._id === otherUserId) || null;
      if (matched) {
        setConvUserMap((prev) => {
          const next = new Map(prev);
          next.set(matched._id, matched);
          return next;
        });
      }
      setActiveUser(matched);
    } catch (error) {
      console.error("Failed to load conversation participant:", error);
    }
  };

  const renderLeftContent = () => {
    if (isSearching) {
      return (
        <>
          <div className="chat-section-label">
            {searching ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Loader2
                  size={10}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Searching...
              </span>
            ) : (
              `Results (${searchResults.length}${searchTotal > searchResults.length ? `/${searchTotal}` : ""})`
            )}
          </div>

          {!searching && searchResults.length === 0 && (
            <div className="chat-list-empty">
              <User size={28} style={{ opacity: 0.2 }} />
              <span>No users found for "{searchQuery}"</span>
            </div>
          )}

          {searchResults.map((u) => (
            <div
              key={u._id}
              className={`chat-conv-item${activeUser?._id === u._id ? " active" : ""}`}
              onClick={() => openConversation(u)}
            >
              <div className="chat-avatar">
                <UserAvatar user={u} />
              </div>
              <div className="chat-conv-meta">
                <div className="chat-conv-name">{u.fullName}</div>
                <div
                  className="chat-conv-sub"
                  style={{ textTransform: "capitalize" }}
                >
                  {getRoleName(u.role)}
                  {u.address ? ` • ${u.address}` : ""}
                </div>
              </div>
            </div>
          ))}
        </>
      );
    }

    if (conversations.length === 0) {
      return (
        <div className="chat-list-empty">
          <MessageCircle size={28} style={{ opacity: 0.2 }} />
          <span>No conversations yet</span>
          <span style={{ fontSize: 11, opacity: 0.6 }}>
            Search for a user to start chatting
          </span>
        </div>
      );
    }

    return (
      <>
        <div className="chat-section-label">
          Recent{loadingConversations ? " • Loading..." : ""}
        </div>
        {conversations.map((conv) => {
          if (conv.type === "group") {
            return (
              <div
                key={conv._id}
                className={`chat-conv-item${activeConversationId === conv._id ? " active" : ""}`}
                onClick={() => selectConversation(conv)}
              >
                <div className="chat-avatar">
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "2px solid var(--border-base)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--surface-200)",
                    }}
                  >
                    <User size={16} />
                  </div>
                </div>
                <div className="chat-conv-meta">
                  <div className="chat-conv-name">
                    {conv.name || "Group Conversation"}
                  </div>
                  <div className="chat-conv-sub">
                    Group • {conv.members.length} members
                  </div>
                  {conv.lastMessageText && (
                    <div className="chat-conv-last">{conv.lastMessageText}</div>
                  )}
                </div>
                <div className="chat-conv-right">
                  {conv.lastMessageAt && (
                    <span className="chat-conv-time">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          const otherId = getOtherUserId(conv);
          const other = convUserMap.get(otherId);
          if (!other) return null;
          return (
            <div
              key={conv._id}
              className={`chat-conv-item${activeConversationId === conv._id ? " active" : ""}`}
              onClick={() => selectConversation(conv)}
            >
              <div className="chat-avatar">
                <UserAvatar user={other} />
                <div className="chat-avatar-online" />
              </div>
              <div className="chat-conv-meta">
                <div className="chat-conv-name">{other.fullName}</div>
                <div
                  className="chat-conv-sub"
                  style={{ textTransform: "capitalize" }}
                >
                  {getRoleName(other.role)}
                  {other.address ? ` • ${other.address}` : ""}
                </div>
                {conv.lastMessageText && (
                  <div className="chat-conv-last">{conv.lastMessageText}</div>
                )}
              </div>
              <div className="chat-conv-right">
                {conv.lastMessageAt && (
                  <span className="chat-conv-time">
                    {formatTime(conv.lastMessageAt)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="chat-page-wrapper">
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div className="chat-layout">
        <div className={`chat-sidebar ${leftOpen ? "open" : "closed"}`}>
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-title">Conversations</div>
            <div className="chat-search-wrap">
              <Search size={13} className="chat-search-icon" />
              <input
                type="text"
                className="chat-search-input"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="chat-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  {searching ? (
                    <Loader2
                      size={12}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <X size={12} />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="chat-conv-list">{renderLeftContent()}</div>
        </div>

        <div
          className="chat-toggle-strip chat-toggle-strip-left"
          onClick={() => setLeftOpen((v) => !v)}
          title={leftOpen ? "Collapse" : "Expand"}
        >
          <div className="chat-toggle-strip-icon">
            {leftOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </div>
        </div>

        <div className="chat-thread">
          {activeConversationId ? (
            <>
              <div className="chat-thread-header">
                {activeUser ? (
                  <>
                    <UserAvatar user={activeUser} size={34} />
                    <div className="chat-online-dot" />
                  </>
                ) : (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "2px solid var(--border-base)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--surface-200)",
                      flexShrink: 0,
                    }}
                  >
                    <User size={14} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="chat-thread-name">
                    {activeUser?.fullName ||
                      currentConversation?.name ||
                      "Group Conversation"}
                  </div>
                  <div
                    className="chat-thread-sub"
                    style={{ textTransform: "capitalize" }}
                  >
                    {activeUser
                      ? `${getRoleName(activeUser.role)}${activeUser.address ? ` • ${activeUser.address}` : ""}`
                      : `group • ${currentConversation?.members.length || 0} members`}
                    {activeTypingNames.length > 0
                      ? ` • ${activeTypingNames.join(", ")} typing...`
                      : ""}
                    {connectionStatus !== "connected"
                      ? ` • ${connectionStatus}`
                      : ""}
                  </div>
                </div>
                <button
                  className="chat-icon-btn"
                  title={rightOpen ? "Hide profile" : "Show profile"}
                  onClick={() => setRightOpen((v) => !v)}
                >
                  <User size={15} />
                </button>
              </div>

              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="chat-empty">
                    <MessageCircle size={48} className="chat-empty-icon" />
                    <span className="chat-empty-text">
                      Start the conversation
                    </span>
                  </div>
                )}

                {messageGroups.map((group, groupIndex) => (
                  <div key={`${group.label}-${groupIndex}`}>
                    <div className="chat-day-divider">
                      <div className="chat-day-divider-line" />
                      <span className="chat-day-divider-label">
                        {group.label}
                      </span>
                      <div className="chat-day-divider-line" />
                    </div>
                    {group.msgs.map((msg, messageIndex) => {
                      const isSent = msg.senderId === currentUserId;
                      const readBy = Array.isArray(msg.readBy)
                        ? msg.readBy
                        : [];
                      return (
                        <div
                          key={`${msg._id || msg.clientTempId || "msg"}-${msg.createdAt}-${messageIndex}`}
                          className={`chat-msg-row${isSent ? " sent" : ""}`}
                        >
                          {!isSent && activeUser && (
                            <UserAvatar user={activeUser} size={26} />
                          )}
                          <div>
                            <div
                              className={`chat-bubble ${isSent ? "sent" : "received"}`}
                            >
                              {msg.content}
                            </div>
                            <div
                              className={`chat-bubble-time${!isSent ? " from-left" : ""}`}
                            >
                              {formatTime(msg.createdAt)}
                              {isSent && readBy.length > 1 ? " • Read" : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-bar">
                <button className="chat-icon-btn" title="Attach">
                  <Paperclip size={15} />
                </button>
                <input
                  ref={inputRef}
                  className="chat-text-input"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputText(value);
                    setTyping(value.trim().length > 0);
                  }}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTyping(false)}
                />
                <button className="chat-icon-btn" title="Emoji">
                  <Smile size={15} />
                </button>
                <button
                  className="chat-send-btn"
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="chat-empty" style={{ flex: 1 }}>
              <MessageCircle size={60} className="chat-empty-icon" />
              <span
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-semibold)",
                  color: "var(--text-secondary)",
                }}
              >
                Select a conversation
              </span>
              <span className="chat-empty-text">
                Search for a user or pick from the list to start messaging
              </span>
            </div>
          )}
        </div>

        <div
          className="chat-toggle-strip chat-toggle-strip-right"
          onClick={() => setRightOpen((v) => !v)}
          title={rightOpen ? "Collapse profile" : "Expand profile"}
        >
          <div className="chat-toggle-strip-icon">
            {rightOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </div>
        </div>

        <div className={`chat-profile ${rightOpen ? "open" : "closed"}`}>
          {activeConversationId ? (
            <>
              <div className="chat-profile-top">
                {activeUser ? (
                  <UserAvatar user={activeUser} size={74} showBorder={false} />
                ) : (
                  <div
                    style={{
                      width: 74,
                      height: 74,
                      borderRadius: "50%",
                      border: "3px solid var(--color-brand-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--surface-200)",
                    }}
                  >
                    <User size={28} />
                  </div>
                )}
                <div className="chat-profile-name">
                  {activeUser?.fullName ||
                    currentConversation?.name ||
                    "Group Conversation"}
                </div>
                <div className="chat-profile-role">
                  {activeUser
                    ? getRoleName(activeUser.role)
                    : `Group • ${currentConversation?.members.length || 0} members`}
                </div>
                {activeUser?.address && (
                  <div className="chat-profile-location">
                    <MapPin size={10} />
                    {activeUser?.address}
                  </div>
                )}
              </div>

              <div className="chat-profile-accordion">
                <button
                  className="chat-profile-accordion-btn"
                  onClick={() => setDetailsOpen((v) => !v)}
                >
                  <span>More Details</span>
                  {detailsOpen ? (
                    <ChevronUp size={13} />
                  ) : (
                    <ChevronDown size={13} />
                  )}
                </button>

                {detailsOpen && (
                  <div className="chat-profile-body">
                    <div>
                      <div className="chat-profile-section-title">
                        {activeUser ? "Contact" : "Group"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {activeUser?.email && (
                          <div className="chat-profile-info-row">
                            <span className="chat-profile-info-label">
                              Email
                            </span>
                            <span className="chat-profile-info-val">
                              {activeUser?.email}
                            </span>
                          </div>
                        )}
                        {activeUser?.phoneNumber && (
                          <div className="chat-profile-info-row">
                            <span className="chat-profile-info-label">
                              Phone
                            </span>
                            <span className="chat-profile-info-val">
                              {activeUser?.phoneNumber}
                            </span>
                          </div>
                        )}
                        {activeUser?.address && (
                          <div className="chat-profile-info-row">
                            <span className="chat-profile-info-label">
                              Location
                            </span>
                            <span className="chat-profile-info-val">
                              {activeUser?.address}
                            </span>
                          </div>
                        )}
                        {!activeUser && currentConversation && (
                          <>
                            <div className="chat-profile-info-row">
                              <span className="chat-profile-info-label">
                                Conversation
                              </span>
                              <span className="chat-profile-info-val">
                                {currentConversation._id}
                              </span>
                            </div>
                            <div className="chat-profile-info-row">
                              <span className="chat-profile-info-label">
                                Members
                              </span>
                              <span className="chat-profile-info-val">
                                {currentConversation.members.length}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="chat-profile-section-title">Status</div>
                      {activeUser ? (
                        <div className="chat-profile-info-row">
                          <span className="chat-profile-info-label">
                            Account
                          </span>
                          <span
                            className="chat-profile-info-val"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: activeUser.emailVerified
                                  ? "var(--color-brand-primary)"
                                  : "var(--color-warning)",
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                            />
                            {activeUser.emailVerified
                              ? "Verified"
                              : "Unverified"}
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <input
                            className="chat-text-input"
                            placeholder="Member user ID"
                            value={groupMemberUserId}
                            onChange={(e) =>
                              setGroupMemberUserId(e.target.value)
                            }
                          />
                          <select
                            className="chat-text-input"
                            value={groupMemberRole}
                            onChange={(e) =>
                              setGroupMemberRole(
                                (e.target.value as "member" | "admin") ||
                                  "member",
                              )
                            }
                          >
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                          </select>
                          <button
                            className="chat-send-btn"
                            disabled={
                              !groupMemberUserId.trim() ||
                              currentConversation?.type !== "group"
                            }
                            onClick={async () => {
                              if (
                                !currentConversation ||
                                currentConversation.type !== "group"
                              )
                                return;
                              await addGroupMember(
                                currentConversation._id,
                                groupMemberUserId.trim(),
                                groupMemberRole,
                              );
                              await loadConversations();
                              setGroupMemberUserId("");
                            }}
                          >
                            Add Member
                          </button>
                          <button
                            className="chat-icon-btn"
                            disabled={
                              !groupMemberUserId.trim() ||
                              currentConversation?.type !== "group"
                            }
                            onClick={async () => {
                              if (
                                !currentConversation ||
                                currentConversation.type !== "group"
                              )
                                return;
                              await removeGroupMember(
                                currentConversation._id,
                                groupMemberUserId.trim(),
                              );
                              await loadConversations();
                              setGroupMemberUserId("");
                            }}
                          >
                            Remove Member
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              className="chat-empty"
              style={{ padding: "32px 14px", flex: 1 }}
            >
              <User size={36} className="chat-empty-icon" />
              <span className="chat-empty-text">
                Select a user to view their profile
              </span>
            </div>
          )}
        </div>
      </div>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
    </div>
  );
};

export default InboxPage;
