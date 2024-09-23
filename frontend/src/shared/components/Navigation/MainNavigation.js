import React from 'react'

import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import './MainNavigation.css'

const MainNavigation = props => {
    return(
        <MainHeader>
            <nav>
                <NavLinks />
            </nav>
        </MainHeader>
    )
}

export default MainNavigation