import React, { useEffect, useState } from 'react'

import UsersList from '../components/UsersList'
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {

    const { sendRequest } = useHttpClient()

    const [loadedUsers, setLoadedUsers] = useState()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users'
                )
                
                setLoadedUsers(responseData.users)
            } catch (err) {
                console.log(err)
            }
        }

        fetchUsers()
    }, [sendRequest])

    return(
        <React.Fragment>
            {loadedUsers && <UsersList items={loadedUsers}/>}
        </React.Fragment>
    )
}

export default Users