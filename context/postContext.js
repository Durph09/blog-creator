import React, { useCallback, useState } from 'react';

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({children}) => {
    const [posts, setPosts] = useState([]);
    const [noMorePosts, setNoMorePosts] = useState(false);

    const deletePost = useCallback((postId) => {
        setPosts(value => {
            const newPosts = [];
            value.forEach(post => {
                if(post._id !== postId) {
                    newPosts.push(post);
                }
            })
        })
    }, []);

    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        console.log('POST FROM SSR: ', postsFromSSR);
        //setPosts(postsFromSSR);
        setPosts ((value) => {
            const newPosts = [...value];
            postsFromSSR.forEach((post )=> {
                const exists = newPosts.find((p) => p._id === post._id);
                if(!exists) {
                    newPosts.push(post);
                }
            });
            return newPosts;
        });

    }, []);

    const getPosts = useCallback(async ({lastPostDate, getNewerPosts = false}) => {
        const results = await fetch(`/api/getPosts`, {
            method: "POST",
            headers: {
                'content-type' : "application/json"
            },
            body: JSON.stringify({lastPostDate, getNewerPosts })
        });
        const json = await results.json();
        const postsResult = json.posts || [];
        console.log("POSTS RESULTS: ", postsResult )
        if(postsResult.length < 5) {
            setNoMorePosts(true);
        }
        setPosts (value =>{
            const newPosts = [...value];
            postsResult.forEach(post => {
                const exists = newPosts.find((p) => p._id === post._id);
                if(!exists) {
                    newPosts.push(post);
                }
            });
            return newPosts;
        });
    }, []);


    return ( 
    <PostsContext.Provider value={{posts, setPostsFromSSR, getPosts, noMorePosts, deletePost}}>
        {children}
        </PostsContext.Provider>
    )
}