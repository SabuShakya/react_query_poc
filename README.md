# React Query

## What?

- Server state management library

## Why?

- React Query comes with built-in query `caching`, which means, once data is fetched, it can be stored in a cache and reused later without making redundant API calls.
- Handles the state management of queries automatically, reducing the need for developers to write and maintain complex state management logic.
- It provides built-in error-handling capabilities.

More Details :

- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Beginners' Guide To React Query](https://refine.dev/blog/react-query-guide/#introduction)

## Installation

```yarn
yarn add @tanstack/react-query
```

Or,

```npm
npm i @tanstack/react-query
```

Recommended to install Eslint Plugin Query:

```yarn
yarn add -D @tanstack/eslint-plugin-query
```

## Basic Data Fetching

### 1. Create a client

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from './register/Signup';

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <Signup />
        </>
    );
}

export default App;
```

### 2. Provide the client to App

We wrap our app's root with QueryClientProvider which takes the QueryClient as client props.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Signup from './register/Signup';

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Signup />
            </QueryClientProvider>
        </>
    );
}

export default App;
```

### 3. Use the useQuery hook to fetch data

```tsx
const {
    data: posts,
    error,
    isLoading,
} = useQuery({ queryKey: ['GET_POSTS'], queryFn: getPosts });
```

or,

```tsx
const { data: posts, error, isLoading} = useQuery({'GET_POSTS', getPosts});
```

The **useQuery** hook is used to fetch data and handle loading and error states. The getPosts function fetches the data using Axios. If data is loading or an error occurs, a message is displayed. Otherwise, the posts are rendered as a list.

The queryKey that we provided here `GET_POSTS` is used as the _identifier_ for the _cache_. The unique key we provide is used internally for refetching, caching, and sharing your queries throughout our application.

The hook performs the fetch and then stores the result in a cache. If `useQuery` is called again with same key, React Query will return the cached data instead of performing a new fetch.

The query result returned by useQuery contains all of the information about the query that you'll need for templating and any other usage of the data such as `isLoading,
error, data, isError, isSuccess, status(success, error or loading), fetchStatus(fetching, paused, idle)`.

## Mutating Data

While useQuery hook is used to "read" operations(fetching data), React Query provides useMutation hook for "write" operations(creating, updating and deleting data).

### Use `useMutation` to post data

```tsx
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
```

### Resetting Mutation State

It's sometimes the case that you need to clear the error or data of a mutation request. To do this, you can use the reset function to handle this `mutation.reset()`:

```tsx
const CreatePosts = () => {
  const [title, setTitle] = useState('')
  const mutation = useMutation({ mutationFn: createPosts })

  const onCreatePosts = (e) => {
    e.preventDefault()
    mutation.mutate({ title })
  }

  return (
    <form onSubmit={onCreatePosts}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  )
}
```

## Query Concepts

- _refetchOnWindowFocus_ : If the user goes to a different browser tab, and then comes back to your app, a background refetch will be triggered automatically, and data on the screen will be updated if something has changed on the server in the meantime.

- _staleTime_ : Duration until a query transitions from fresh to stale. As long as the query is fresh data will be fetched from cache, no network requests. If query is stale(default - instantly), a background refetch may happen.

- _cacheTime_ : Duration until inactive queries will be removed from cache, default - 5minutes. When all components which use the query have unmounted, the query transitions to inactive state.

## Query Keys

Query keys have to be an Array at the top level, and can be as simple as an Array with a single string, or as complex as an array of many strings and nested objects.
When a query needs more information to uniquely describe its data, you can use an array with a string and any number of serializable objects to describe it.

```tsx
// An individual todo
useQuery({ queryKey: ['todo', 5], ... })

// An individual todo in a "preview" format
useQuery({ queryKey: ['todo', 5, { preview: true }], ...})

// A list of todos that are "done"
useQuery({ queryKey: ['todos', { type: 'done' }], ... })
```

Since query keys uniquely describe the data they are fetching, they should include any variables you use in your query function that change. For example:

```tsx
function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ['todos', todoId],
    queryFn: () => fetchTodoById(todoId),
  })
}
```

## Query Functions

Any function that returns a promise. The promise that is returned should either resolve the data or throw an error.

Query keys are not just for uniquely identifying the data you are fetching, but also can be conveniently passed into query function as part of the QueryFunctionContext.

```tsx
function Posts({ status, page }) {
  const result = useQuery({
    queryKey: ['posts', { status, page }],
    queryFn: fetchPostList,
  })
}

// Access the key, status and page variables in your query function!
function fetchPostList({ queryKey }) {
  const [_key, { status, page }] = queryKey
  // Do something with status,page
  return new Promise()
}
```

## useQueries

Dynamic parallel queries can be made with useQueries.
useQueries accepts an options object with a queries key whose value is an array of query objects. It returns an array of query results:

```tsx
function App({ users }) {
  const userQueries = useQueries({
    queries: users.map((user) => {
      return {
        queryKey: ['user', user.id],
        queryFn: () => fetchPostsByUserId(user.id),
      }
    }),
  })
}
```

## Dependent Queries

If the execution of any query depends on another query, we can use the enabled option to tell the dependent query when  to execute.

```tsx
// 1. Get the user
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const userId = user?.id

// 2. Then get the user's posts
const {
  status,
  fetchStatus,
  data: posts,
} = useQuery({
  queryKey: ['posts', userId],
  queryFn: getPostsByUser,
  // The query will not execute until the userId exists
  enabled: !!userId,
})
```

## Query retries

```tsx
import { useQuery } from '@tanstack/react-query'

// Make a specific query retry a certain number of times
const result = useQuery({
  queryKey: ['posts', 1],
  queryFn: fetchPostList,
  retry: 10, // Will retry failed requests 10 times before displaying an error
})
```

Setting retry = false will disable retries.
Setting retry = 6 will retry failing requests 6 times before showing the final error thrown by the function.
Setting retry = true will infinitely retry failing requests.
Setting retry = (failureCount, error) => ... allows for custom logic based on why the request failed.
tsx

## Paginated Queries

Just add the page information in query key!

```tsx
const result = useQuery({
  queryKey: ['posts', page],
  queryFn: fetchPosts
})
```

### `keepPreviousData` for better pagination

- The data from the last successful fetch is available while new data is being requested, even though the query key has changed.
- When the new data arrives, the previous data is seamlessly swapped to show the new data.
- `isPreviousData` is made available to know what data the query is currently providing you

```tsx
function Posts() {
  const [page, setPage] = React.useState(0)

  const fetchPosts = (page = 0) => fetch('/api/posts?page=' + page).then((res) => res.json())

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    keepPreviousData : true
  })

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.posts.map(post => (
            <p key={post.id}>{post.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage(old => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>{' '}
      <button
        onClick={() => {
          if (!isPreviousData && data.hasMore) {
            setPage(old => old + 1)
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}{' '}
    </div>
  )
}
```

## Mutation Side Effects

`useMutation` comes with some helper options that allow quick and easy side-effects at any stage during the mutation lifecycle. These come in handy for both invalidating and refetching queries after mutations and even optimistic updates

```tsx
useMutation({
  mutationFn: addTodo,
  onMutate: (variables) => {
    // A mutation is about to happen!

    // Optionally return a context containing data to use when for example rolling back
    return { id: 1 }
  },
  onError: (error, variables, context) => {
    // An error happened!
    console.log(`rolling back optimistic update with id ${context.id}`)
  },
  onSuccess: (data, variables, context) => {
    // Boom baby!
  },
  onSettled: (data, error, variables, context) => {
    // Error or success... doesn't matter!
  },
})
```
