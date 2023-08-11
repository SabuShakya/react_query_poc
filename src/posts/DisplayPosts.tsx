import { isError } from "@tanstack/react-query";
import { IDisplayProps } from "./interface/IDisplayProps";
import { IPost } from "./interface/IPost";

export const DisplayPosts = ({ isLoading, error, posts }: IDisplayProps) => {
  if (isLoading) return <div>Fetching posts...</div>;

  if (isError(error)) return <div>An error occurred: {error?.message}</div>;

  return (
    <ul>
      {posts.map((post: IPost) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
