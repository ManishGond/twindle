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
import axios from "axios";
import { socket } from "../../utils/socket";
import { FaMessage } from "react-icons/fa6";

const FloatingChat = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, roomId, view } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth.user);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasJoined = useRef(false); // ✅ To prevent re-joining
  const hasLeft = useRef(false);

  // ✅ Join room + fetch messages + set up listeners
  useEffect(() => {
    if (view !== "chat" || !roomId || !user?.email || hasJoined.current) return;

    const username = user.email;
    hasJoined.current = true;

    socket.emit("join_room", { roomId, username });

    axios.get(`/api/chat/${roomId}/messages`).then((res) => {
      res.data.forEach((msg: any) => dispatch(addMessage(msg)));
    });

    const handleMessage = (msg: any) => dispatch(addMessage(msg));
    const handleSystemMsg = (msg: string) =>
      dispatch(addMessage({ sender: "System", content: msg }));
    const handleRoomUsers = (users: string[]) => setOnlineUsers(users);

    socket.on("receive_message", handleMessage);
    socket.on("system_message", handleSystemMsg);
    socket.on("room_users", handleRoomUsers);

    return () => {
      if (!hasLeft.current) {
        socket.emit("leave_room", { roomId, username });
        hasLeft.current = true;
      }

      socket.off("receive_message", handleMessage);
      socket.off("system_message", handleSystemMsg);
      socket.off("room_users", handleRoomUsers);
      hasJoined.current = false;
      hasLeft.current = false;
    };

  }, [roomId, view, user]);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleChat = () => dispatch(toggleChat());

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      dispatch(setView("chat"));
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = crypto.randomUUID().split("-")[0];
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
  };

  const renderMessages = () =>
    messages.map((msg, idx) => {
      const isSystem = msg.sender === "System";
      const isCurrentUser = msg.sender === user?.email;

      return (
        <p key={idx} className={isSystem ? styles.systemMessage : ""}>
          <b>{isSystem ? "System" : isCurrentUser ? "You" : msg.sender}:</b> {msg.content}
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
            <button onClick={() => dispatch(setView("default"))}>← Back</button>
          </div>
        );
      case "chat":
        return (
          <>
            <div className={styles.header}>
              <span>Room: <b>{roomId}</b></span>
              <span>🟢 Online: {onlineUsers.length}</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleLeaveRoom}>Leave Room</button>
                <button onClick={handleToggleChat}>✖</button>
              </div>
            </div>

            <div className={styles.chatMessages}>
              {messages.length === 0 ? (
                <p><i>No messages yet...</i></p>
              ) : renderMessages()}
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
