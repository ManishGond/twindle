import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Video } from "../../utils/data";

interface VideosState {
  videos: Video[];
}

const initialState: VideosState = {
  videos: JSON.parse(localStorage.getItem("videos") || "[]"),
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setVideos(state, action: PayloadAction<Video[]>) {
      state.videos = action.payload;
      localStorage.setItem("videos", JSON.stringify(action.payload));
    },
    addVideo(state, action: PayloadAction<Video>) {
      state.videos.unshift(action.payload);
      localStorage.setItem("videos", JSON.stringify(state.videos));
    },
  },
});

export const { addVideo, setVideos } = videoSlice.actions;
export default videoSlice.reducer;
