export interface VideoType {
  id: string;
  url: string;
  title: string;
  tags: string[];
  creator: {
    name: string;
    avatar: string;
    followers: string;
  };
}
