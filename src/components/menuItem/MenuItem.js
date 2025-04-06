import React from 'react'
import { useNavigate } from 'react-router-dom';
import './MenuItem.css'

function MenuItem({image, title}) {

    const history = useNavigate();
    
    return (
        <div onClick={() => history(`/${title}`)} className="menuItem">
            {image ? <img src={image} alt=""/> : null}
            <span>{title}</span>
        </div>
    )
}

export default MenuItem
