import { configureStore } from "@reduxjs/toolkit";
import videosReducer from "../features/videos/videosSlice";
import authReducer from "../features/auth/authSlice"
import chatReducer from "../features/chat/chatSlice"

export const store = configureStore({
  reducer: {
    videos: videosReducer,
    auth: authReducer,
    chat: chatReducer,
  },
});

// ✅ Types for useDispatch and useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
