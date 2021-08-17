import React from 'react'
import { useHistory } from 'react-router-dom';
import './MenuItem.css'

function MenuItem({image, title}) {

    const history = useHistory();
    
    return (
        <div onClick={() => history.push(`/${title}`)} className="menuItem">
            {image ? <img src={image} alt=""/> : null}
            <span>{title}</span>
        </div>
    )
}

export default MenuItem
