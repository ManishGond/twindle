import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ChatView = "default" | "join" | "create" | "chat";

interface ChatState {
  isOpen: boolean;
  view: ChatView;
  roomId: string;
  messages: { sender: string; content: string; timestamp: number }[];
}

const initialState: ChatState = {
  isOpen: false,
  view: "default",
  roomId: "",
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    openChat(state) {
      state.isOpen = true;
    },
    closeChat(state) {
      state.isOpen = false;
    },
    setView(state, action: PayloadAction<ChatView>) {
      state.view = action.payload;
    },
    setRoomId(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    leaveRoom(state) {
      state.roomId = "";
      state.view = "default";
      state.messages = [];
    },
    addMessage(
      state,
      action: PayloadAction<{
        sender: string;
        content: string;
        timestamp?: number;
      }>
    ) {
      state.messages.push({
        ...action.payload,
        timestamp: action.payload.timestamp ?? Date.now(),
      });
    },
  },
});

export const {
  addMessage,
  closeChat,
  leaveRoom,
  openChat,
  setRoomId,
  setView,
  toggleChat,
} = chatSlice.actions;

export default chatSlice.reducer;
