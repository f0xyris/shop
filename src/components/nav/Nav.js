import React from 'react'
import './Nav.css'

import { useHistory } from 'react-router';

function Nav() {

    const history = useHistory();

    return (
        <div className="nav">
            <ul className="nav__items">
                <li onClick={() => history.push("/")}>Home</li>
                <li onClick={() => history.push("/menu")}>Menu</li>
                <li onClick={() => history.push("/delivery")}>Delivery</li>
                <li onClick={() => history.push("/customers")}>For customers</li>
                <li onClick={() => history.push("/news")}>News</li>
            </ul>
        </div>
    )
}

export default Nav
