import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Posts from './posts/Posts';
import CreatePosts from './posts/CreatePosts';

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <CreatePosts />
                <Posts />
            </QueryClientProvider>
        </>
    );
}

export default App;
