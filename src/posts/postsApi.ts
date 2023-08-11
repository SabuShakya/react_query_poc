import axios from "axios";
import { IPost } from "./interface/IPost";

export const getPosts = async (): Promise<IPost[]> => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
};

export const createPosts = async (newPost: IPost) => {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    newPost
  );
  return response.data;
};
