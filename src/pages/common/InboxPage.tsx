import { useAuth } from "@/Context/useAuth";
import { adminService, type ApiUser } from "@/services/admin.service";
import {
  chatService,
  type ChatMessage,
  type Conversation,
} from "@/services/chat.service";
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
import { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/InboxPage.css";

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
    "#2e7d52","#1565c0","#6a1b9a","#ad1457","#e65100",
    "#2e7d32","#00695c","#37474f","#558b2f","#4527a0",
  ];
  const colorIdx =
    user.fullName
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
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
  const { user: authUser } = useAuth();
  const currentUserId = authUser?._id || "";

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [convUserMap, setConvUserMap] = useState<Map<string, ApiUser>>(new Map());

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ApiUser[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searching, setSearching] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeUser, setActiveUser] = useState<ApiUser | null>(null);

  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!currentUserId) return;
    const convs = chatService.getConversations(currentUserId);
    setConversations(convs);

    const participantIds = [
      ...new Set(
        convs.flatMap((c) =>
          c.participantIds.filter((id) => id !== currentUserId),
        ),
      ),
    ];

    if (participantIds.length === 0) return;

    (async () => {
      try {
        const resp = await adminService.getAllUsers(1, 200);
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
  }, [currentUserId]);

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
        const resp = await adminService.getAllUsers(1, 20, {
          search: query.trim(),
          sort: "-createdAt",
        });
        setSearchResults(resp.data.filter((u) => u._id !== currentUserId));
        setSearchTotal(Math.max(0, resp.pagination.totalDocs));
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
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    setMessages(chatService.getMessages(activeConvId));
    chatService.markAsRead(activeConvId, currentUserId);
    setConversations(chatService.getConversations(currentUserId));
  }, [activeConvId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = (otherUser: ApiUser) => {
    if (!currentUserId) return;
    const conv = chatService.getOrCreateConversation(
      currentUserId,
      otherUser._id,
    );
    setActiveConvId(conv.id);
    setActiveUser(otherUser);
    setConvUserMap((prev) => {
      const next = new Map(prev);
      next.set(otherUser._id, otherUser);
      return next;
    });
    setConversations(chatService.getConversations(currentUserId));
    setSearchQuery("");
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !activeConvId || !currentUserId) return;
    chatService.sendMessage(activeConvId, currentUserId, inputText);
    setMessages(chatService.getMessages(activeConvId));
    setConversations(chatService.getConversations(currentUserId));
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupMessagesByDay = (msgs: ChatMessage[]) => {
    const groups: { label: string; msgs: ChatMessage[] }[] = [];
    let lastDay = "";
    for (const m of msgs) {
      const day = new Date(m.timestamp).toDateString();
      if (day !== lastDay) {
        groups.push({ label: formatDayLabel(m.timestamp), msgs: [] });
        lastDay = day;
      }
      groups[groups.length - 1].msgs.push(m);
    }
    return groups;
  };

  const messageGroups = groupMessagesByDay(messages);
  const isSearching = searchQuery.trim().length > 0;

  const getOtherUserId = (c: Conversation) =>
    c.participantIds.find((id) => id !== currentUserId) || "";

  const renderLeftContent = () => {
    if (isSearching) {
      return (
        <>
          <div className="chat-section-label">
            {searching ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />
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
                <div className="chat-conv-sub" style={{ textTransform: "capitalize" }}>
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
          <span style={{ fontSize: 11, opacity: 0.6 }}>Search for a user to start chatting</span>
        </div>
      );
    }

    return (
      <>
        <div className="chat-section-label">Recent</div>
        {conversations.map((conv) => {
          const otherId = getOtherUserId(conv);
          const other = convUserMap.get(otherId);
          if (!other) return null;
          return (
            <div
              key={conv.id}
              className={`chat-conv-item${activeConvId === conv.id ? " active" : ""}`}
              onClick={() => openConversation(other)}
            >
              <div className="chat-avatar">
                <UserAvatar user={other} />
                <div className="chat-avatar-online" />
              </div>
              <div className="chat-conv-meta">
                <div className="chat-conv-name">{other.fullName}</div>
                <div className="chat-conv-sub" style={{ textTransform: "capitalize" }}>
                  {getRoleName(other.role)}
                  {other.address ? ` • ${other.address}` : ""}
                </div>
                {conv.lastMessage && (
                  <div className="chat-conv-last">{conv.lastMessage}</div>
                )}
              </div>
              <div className="chat-conv-right">
                {conv.lastMessageTime && (
                  <span className="chat-conv-time">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                )}
                {conv.unreadCount > 0 && (
                  <span className="chat-unread-badge">{conv.unreadCount}</span>
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
                    <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
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
          {activeUser ? (
            <>
              <div className="chat-thread-header">
                <UserAvatar user={activeUser} size={34} />
                <div className="chat-online-dot" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="chat-thread-name">{activeUser.fullName}</div>
                  <div className="chat-thread-sub" style={{ textTransform: "capitalize" }}>
                    {getRoleName(activeUser.role)}
                    {activeUser.address ? ` • ${activeUser.address}` : ""}
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
                      Start the conversation with {activeUser.fullName}
                    </span>
                  </div>
                )}

                {messageGroups.map((group) => (
                  <div key={group.label}>
                    <div className="chat-day-divider">
                      <div className="chat-day-divider-line" />
                      <span className="chat-day-divider-label">{group.label}</span>
                      <div className="chat-day-divider-line" />
                    </div>
                    {group.msgs.map((msg) => {
                      const isSent = msg.senderId === currentUserId;
                      return (
                        <div key={msg.id} className={`chat-msg-row${isSent ? " sent" : ""}`}>
                          {!isSent && <UserAvatar user={activeUser} size={26} />}
                          <div>
                            <div className={`chat-bubble ${isSent ? "sent" : "received"}`}>
                              {msg.text}
                            </div>
                            <div className={`chat-bubble-time${!isSent ? " from-left" : ""}`}>
                              {formatTime(msg.timestamp)}
                              {isSent && msg.read ? " • Read" : ""}
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
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
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
              <span style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-semibold)", color: "var(--text-secondary)" }}>
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
          {activeUser ? (
            <>
              <div className="chat-profile-top">
                <UserAvatar user={activeUser} size={74} showBorder={false} />
                <div className="chat-profile-name">{activeUser.fullName}</div>
                <div className="chat-profile-role">
                  {getRoleName(activeUser.role)}
                </div>
                {activeUser.address && (
                  <div className="chat-profile-location">
                    <MapPin size={10} />
                    {activeUser.address}
                  </div>
                )}
              </div>

              <div className="chat-profile-accordion">
                <button
                  className="chat-profile-accordion-btn"
                  onClick={() => setDetailsOpen((v) => !v)}
                >
                  <span>More Details</span>
                  {detailsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {detailsOpen && (
                  <div className="chat-profile-body">
                    <div>
                      <div className="chat-profile-section-title">Contact</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {activeUser.email && (
                          <div className="chat-profile-info-row">
                            <span className="chat-profile-info-label">Email</span>
                            <span className="chat-profile-info-val">{activeUser.email}</span>
                          </div>
                        )}
                        {activeUser.phoneNumber && (
                          <div className="chat-profile-info-row">
                            <span className="chat-profile-info-label">Phone</span>
                            <span className="chat-profile-info-val">{activeUser.phoneNumber}</span>
                          </div>
                        )}
                        {activeUser.address && (
                          <div className="chat-profile-info-row">
                            <span className="chat-profile-info-label">Location</span>
                            <span className="chat-profile-info-val">{activeUser.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="chat-profile-section-title">Status</div>
                      <div className="chat-profile-info-row">
                        <span className="chat-profile-info-label">Account</span>
                        <span className="chat-profile-info-val" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: activeUser.emailVerified ? "var(--color-brand-primary)" : "var(--color-warning)",
                            display: "inline-block", flexShrink: 0,
                          }} />
                          {activeUser.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="chat-empty" style={{ padding: "32px 14px", flex: 1 }}>
              <User size={36} className="chat-empty-icon" />
              <span className="chat-empty-text">Select a user to view their profile</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
