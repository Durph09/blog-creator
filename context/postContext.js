import React, { useCallback, useState } from 'react';

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({children}) => {
   
    const [posts, setPosts] = useState([]);

    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        console.log('POST FROM SSR: ', postsFromSSR);
        setPosts(postsFromSSR);

    }, []);

    const getPosts = useCallback(async ({lastPostDate}) => {
        const results = await fetch(`/api/getPosts`, {
            method: "POST",
            headers: {
                'content-type' : "application/json"
            },
            body: JSON.stringify({lastPostDate})
        });
        const json = await results.json();
        const postResult = json.posts || [];
        console.log("POSTS RESULTS: ", postResult )
    }, [])


    return ( 
    <PostsContext.Provider value={{posts, setPostsFromSSR, getPosts}}>
        {children}
        </PostsContext.Provider>
    )
}