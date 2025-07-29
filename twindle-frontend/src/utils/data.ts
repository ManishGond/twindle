// /utils/data.ts

export type Video = {
  id: string;
  videoUrl: string;
  title: string;
  tags: string[];
  likes: number;
  comments: number;
  creator: {
    name: string;
    avatar: string;
    followers: string;
  };
};

// Sample mock data using W3Schools MP4 links
export const mockVideos: Video[] = [
  {
    id: "1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Big Buck Bunny 🐰",
    tags: ["animation", "funny"],
    likes: 1240,
    comments: 140,
    creator: {
      name: "Pixarish",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      followers: "90K",
    },
  },
  {
    id: "2",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    title: "Bear in the Wild 🐻",
    tags: ["nature", "animals"],
    likes: 980,
    comments: 52,
    creator: {
      name: "NatureCam",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      followers: "132K",
    },
  },
];
