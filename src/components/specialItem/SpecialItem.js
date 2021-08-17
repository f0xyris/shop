import React from 'react'
import './SpecialItem.css'

function SpecialItem({image, title, desc}) {
    return (
        <div className="specialItem">
            <img src={image} alt={image}/>
            <h4>{title}</h4>
            <h5>{desc}</h5>
        </div>
    )
}

export default SpecialItem
