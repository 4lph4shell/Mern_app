import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PostList from '../components/PostList'
import { useHttpClient } from '../../shared/hooks/http-hook'

const UserPosts = () => {

    const [loadedPosts, setLoadedPosts] = useState()

    const { sendRequest } = useHttpClient()

    const userId = useParams().userId

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/posts/user/${userId}`
                )
                setLoadedPosts(responseData.posts)
            } catch (err) {}
        }

        fetchPosts()

    }, [sendRequest, userId])

    const postDeletedHandler = (deletedPostId) => {
        setLoadedPosts(prevPosts =>
            prevPosts.filter(post => post.id !== deletedPostId)    
        )
    }

    return(
        <React.Fragment>
            {loadedPosts && <PostList items={loadedPosts} 
                onDeletedPost={postDeletedHandler}
            />}
        </React.Fragment>
    )
}

export default UserPosts