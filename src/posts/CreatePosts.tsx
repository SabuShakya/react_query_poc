import { isError, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createPosts } from './postsApi';
import { IPost } from './interface/IPost';

const CreatePosts = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const createPost = useMutation((newPost: IPost) => createPosts(newPost));

    const submitData = () => {
        createPost.mutate({ title, body });
    };

    if (createPost.isLoading) {
        return <span>Submitting...</span>;
    }

    if (createPost.isError) {
        if (isError(createPost.error))
            return <span>Error: {createPost.error?.message}</span>;
    }

    if (createPost.isSuccess) {
        return <span>Post submitted!</span>;
    }

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Body"
            />
            <button onClick={submitData}>Submit</button>
        </div>
    );
};

export default CreatePosts;
