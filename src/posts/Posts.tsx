import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./postsApi";
import { DisplayPosts } from "./DisplayPosts";

const Posts = () => {
  const {
    data: posts = [],
    error,
    isLoading,
  } = useQuery({ queryKey: ["GET_POSTS"], queryFn: getPosts });

  return (
    <>
      <DisplayPosts isLoading={isLoading} posts={posts} error={error} />
    </>
  );
};

export default Posts;
