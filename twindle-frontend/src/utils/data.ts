export type Video = {
  id: string;
  videoUrl: string;
  title: string;
  tags: string[];
  likes: number;
  dislikes: number;
  comments: string[];
  creator: {
    name: string;
    avatar?: string;
    followers?: number;
  };
};
