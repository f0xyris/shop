import React from 'react'
import './Footer.css'
import footerImg from '../../images/footer.svg'

import Nav from '../nav/Nav'

function Footer() {
    return (
        <div className="footer">
            <div className="footer__info">
                <img src={footerImg} alt="footer"/>
                <span>© Ninja Sushi. All rights reserved.</span>
                <h5>Privacy policy</h5>
            </div>
            <div className="footer__nav">
                <span>Navigation:</span>
                <Nav />
            </div>
            <div className="footer__checkout">
                <span>Checkout:</span>
                <a href="tel:+38(099)9648090">+38 (099) 964 80 90</a>
                <a href="tel:+38(099)9648090">+38 (099) 964 80 90</a>
                <a href="tel:+38(099)9648090">+38 (099) 964 80 90</a>
            </div>
            <div className="footer__work">
                <span>Working hours:</span>
                <p>from 11:00 to 22:45</p>
            </div>
        </div>
    )
}

export default Footer
