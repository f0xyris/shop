import React from 'react'
import './Nav.css'

import { useNavigate } from 'react-router';

function Nav() {

    const history = useNavigate();

    return (
        <div className="nav">
            <ul className="nav__items">
                <li onClick={() => history("/shop")}>Home</li>
                <li onClick={() => history("/menu")}>Menu</li>
                <li onClick={() => history("/delivery")}>Delivery</li>
                <li onClick={() => history("/customers")}>For customers</li>
                <li onClick={() => history("/news")}>News</li>
            </ul>
        </div>
    )
}

export default Nav
