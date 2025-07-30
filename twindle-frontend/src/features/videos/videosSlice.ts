import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Video } from "../../utils/data";

interface VideosState {
  videos: Video[];
  lastUpdated: number | null;
}

const initialState: VideosState = {
  videos: [],
  lastUpdated: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
      state.lastUpdated = Date.now();
    },
    clearVideos: (state) => {
      state.videos = [];
      state.lastUpdated = null;
    },
    addVideo: (state, action: PayloadAction<Video>) => {
      state.videos.unshift(action.payload);
      state.lastUpdated = Date.now(); // 💡 Refresh timestamp
    },
  },
});

export const { clearVideos, setVideos, addVideo } = videoSlice.actions;
export default videoSlice.reducer;
