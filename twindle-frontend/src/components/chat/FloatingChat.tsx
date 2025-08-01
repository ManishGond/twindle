import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/FloatingChat.module.css";
import { AnimatePresence, motion } from "framer-motion";
import type { RootState } from "../../store/store";
import {
  addMessage,
  setRoomId,
  setView,
  toggleChat,
  leaveRoom,
} from "../../features/chat/chatSlice";
import { socket } from "../../utils/socket";
import { FaMessage } from "react-icons/fa6";

const FloatingChat = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, roomId, view } = useSelector(
    (state: RootState) => state.chat
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasJoined = useRef(false);
  const hasLeft = useRef(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    if (view !== "chat" || !roomId || !user?.email || hasJoined.current) return;

    const username = user.email;
    hasJoined.current = true;

    socket.emit(
      "join_room",
      { roomId, username },
      (response: { success?: boolean; error?: string }) => {
        if (response?.error) {
          console.error("Join failed:", response.error);
        } else {
          console.log("Joined successfully");
        }
      }
    );

    socket.on("error_join", (errMsg: string) => {
      setJoinError(errMsg);
      dispatch(setView("join"));
    });

    socket.on("receive_message", (msg) => dispatch(addMessage(msg)));
    socket.on("system_message", (msg: string) =>
      dispatch(addMessage({ sender: "System", content: msg }))
    );
    socket.on("room_users", (users: string[]) => setOnlineUsers(users));
    socket.on("chat_history", (msgs: any[]) =>
      msgs.forEach((msg) => dispatch(addMessage(msg)))
    );

    return () => {
      if (!hasLeft.current) {
        socket.emit("leave_room", { roomId, username });
      }

      socket.off("receive_message");
      socket.off("system_message");
      socket.off("room_users");
      socket.off("chat_history");
      socket.off("error_join");

      hasJoined.current = false;
      hasLeft.current = false;
    };
  }, [roomId, view, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleChat = () => dispatch(toggleChat());

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setJoinError("Room ID cannot be empty.");
      return;
    }
    setJoinError("");
    dispatch(setView("chat"));
  };

  const handleCreateRoom = () => {
    const newRoomId = crypto.randomUUID().split("-")[0];
    socket.emit("create_room", { roomId: newRoomId });
    dispatch(setRoomId(newRoomId));
    dispatch(setView("chat"));
  };

  const handleSendMessage = () => {
    if (!message.trim() || !user?.email) return;

    const msg = {
      sender: user.email,
      content: message,
      roomId,
    };

    socket.emit("send_message", msg);
    setMessage("");
  };

  const handleLeaveRoom = () => {
    if (!user?.email || hasLeft.current) return;
    socket.emit("leave_room", { roomId, username: user.email });
    hasLeft.current = true;
    dispatch(leaveRoom());
    window.location.reload(); // brute force but reliable
  };

  const handleBackToDefault = () => {
    setJoinError("");
    hasJoined.current = false;
    dispatch(setView("default"));
  };

  const renderMessages = () =>
    messages.map((msg, idx) => {
      const isSystem = msg.sender === "System";
      const isCurrentUser = msg.sender === user?.email;

      return (
        <p key={idx} className={isSystem ? styles.systemMessage : ""}>
          <b>{isSystem ? "System" : isCurrentUser ? "You" : msg.sender}:</b>{" "}
          {msg.content}
        </p>
      );
    });

  const renderContent = () => {
    switch (view) {
      case "default":
        return (
          <div className={styles.chatChoice}>
            <button onClick={() => dispatch(setView("join"))}>Join Room</button>
            <button onClick={handleCreateRoom}>Create Room</button>
          </div>
        );
      case "join":
        return (
          <div className={styles.roomInput}>
            <p>Enter Room ID:</p>
            <input
              value={roomId}
              onChange={(e) => dispatch(setRoomId(e.target.value))}
            />
            <button onClick={handleJoinRoom}>Join</button>
            <button onClick={handleBackToDefault}>← Back</button>
            {joinError && <p className={styles.error}>{joinError}</p>}
          </div>
        );
      case "chat":
        return (
          <>
            <div className={styles.header}>
              <span>
                Room: <b>{roomId}</b>
              </span>
              <span>🟢 Online: {onlineUsers.length}</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleLeaveRoom}>Leave Room</button>
                <button onClick={handleToggleChat}>✖</button>
              </div>
            </div>

            <div className={styles.chatMessages}>
              {messages.length === 0 ? (
                <p>
                  <i>No messages yet...</i>
                </p>
              ) : (
                renderMessages()
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatInput}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
              />
              <button onClick={handleSendMessage} disabled={!message.trim()}>
                Send
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <motion.button
        className={styles.chatButton}
        onClick={handleToggleChat}
        whileTap={{ scale: 0.9 }}
      >
        <FaMessage />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;
