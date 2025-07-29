// /utils/data.ts
export type Video = {
  id: string;
  videoUrl: string;
  title: string;
  tags: string[];
  likes: number;       // if not implemented yet, set to 0 in backend
  comments: number;    // if not implemented yet, set to 0 in backend
  creator: {
    name: string;
    avatar?: string;    // optional for now
    followers?: number; // optional for now
  };
};
