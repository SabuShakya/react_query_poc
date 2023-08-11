import { IPost } from "./IPost";

export interface IDisplayProps {
    isLoading?: boolean;
    error: unknown;
    posts: Array<IPost>;
}
