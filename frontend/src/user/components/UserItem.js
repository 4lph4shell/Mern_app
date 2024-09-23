import React from 'react'
import { Link } from 'react-router-dom'

import './UserItem.css'

const UserItem = props => {
    return(
        <li>
            <Link to={`/${props.id}/posts`}>
                <div className="user-avatar">
                    <img src={`http://localhost:5000/${props.image}`} alt={props.name}/>
                </div>
                <div>
                    <h2>{props.name}</h2>
                    <h3>تعداد پست‌ها: {props.postCount}</h3>
                </div>
            </Link>
        </li>
    )
}

export default UserItem