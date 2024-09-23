import React from 'react'

import PostItem from './PostItem'
import './PostList.css'

const PostList = props => {
    if (props.items.length === 0) {
        return(
            <div>
                <h2>پست وجود ندارد.</h2>
            </div>
        )
    }
    return(
        <div className="center main post">
            <ul>
                {
                    props.items.map(post => {
                        return <PostItem 
                            key={post.id}
                            id={post.id}
                            image={post.image}
                            title={post.title}
                            description={post.description}
                            creatorId={post.creator}
                            onDelete={props.onDeletedPost}
                        />
                    })
                }
            </ul>
        </div>
    )
}

export default PostList