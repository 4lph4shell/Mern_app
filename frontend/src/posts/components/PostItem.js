import React, { useContext } from 'react'

import Button from '../../shared/components/FormElements/Button'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './PostItem.css'

const PostItem = props => {

    const { sendRequest } = useHttpClient()

    const auth = useContext(AuthContext)

    const deleteHandler = async () => {
        
        try {
            await sendRequest(
                `http://localhost:5000/api/posts/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            )

            props.onDelete(props.id)

        } catch (err) {}

    }

    return(
        <li>
            <div>
                <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
            </div>
            <div>
                <h2>{props.title}</h2>
                <h3>{props.description}</h3>
            </div>
            <div>
                {auth.isLoggedIn &&
                    <Button
                        onClick={deleteHandler}
                    >
                        حذف
                    </Button>
                }
            </div>
        </li>
    )
}

export default PostItem