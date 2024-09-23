import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { AuthContext } from '../../context/auth-context'
import './NavLinks.css'

const NavLinks = props => {
    const auth = useContext(AuthContext)
    return(
        <div className="nav">
            <ul>
                <li>
                    <NavLink to="/">صفحه اصلی</NavLink>
                </li>
                {auth.isLoggedIn && (
                    <li>
                        <NavLink to={`/${auth.userId}/posts`}>پست‌های من</NavLink>
                    </li>
                )}
                {auth.isLoggedIn && (
                    <li>
                        <NavLink to="/posts/new">افزودن پست</NavLink>
                    </li>
                )}
                {!auth.isLoggedIn && (
                    <li>
                        <NavLink to="/auth">ورود و ثبت نام</NavLink>
                    </li>
                )}
                {auth.isLoggedIn && (
                    <li>
                        <button
                            onClick={auth.logout}
                        >
                            خروج
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default NavLinks