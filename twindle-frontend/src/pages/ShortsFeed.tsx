// /pages/ShortsFeed.tsx
import { useParams } from "react-router-dom";
import SwipeContainer from "../components/Feed/SwipeContainer";

export const ShortsFeed = () => {
  const { id } = useParams();

  return <SwipeContainer startVideoId={id} />;
};
