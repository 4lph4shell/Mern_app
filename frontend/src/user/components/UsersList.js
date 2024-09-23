import React from 'react'

import UserItem from './UserItem'
import './UsersList.css'

const UsersList = props => {
    if (props.items.length === 0) {
        return(
            <div className="center">
                <h2>کاربری وجود ندارد.</h2>
            </div>
        )
    }
    return(
        <div className="center main">
            <ul>
                {
                    props.items.map(user => {
                        return <UserItem 
                            key={user.id}
                            id={user.id}
                            image={user.image}
                            name={user.name}
                            postCount={user.posts.length}
                        />
                    })
                }
            </ul>
        </div>
    )
}

export default UsersList