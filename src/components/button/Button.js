import React from 'react'
import './Button.css'

function Button({title, type, isDisabled, action}) {
    
    return (
        <div className="button">
            <button 
                className = {type} 
                disabled = {isDisabled}
                onClick = {action} 
            >
                {title}
            </button>
        </div>
    )
}

export default Button
