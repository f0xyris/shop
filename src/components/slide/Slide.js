import React from 'react'
import slide from '../../images/ibm.jpg'
import Button from '../../components/button/Button'

import './Slide.css'
import { useHistory } from 'react-router'

function Slide() {
    
    const history = useHistory()

    return (
        <div className="slide">
            <div className="slide__info">
                <h1>Sushi delivery for true connoisseurs</h1>
                <p>Order premium sushi for the whole company - home and office!</p>
                <Button  
                    title = "Order now"
                    type = "action"
                    disabled = {false}
                    action = {() => history.push('/menu')}
                />
            </div>
            <div className="slide__image">
                <img src={slide} alt="slide"/>
            </div>
        </div>
    )
}

export default Slide
