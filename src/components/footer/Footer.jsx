import React from "react";
import "./Footer.css";
import footerImg from "../../images/footer.svg";

import Nav from "../nav/Nav";

function Footer() {
  return (
    <div className="footer items-start flex-col w-[100vw] lg:flex-row lg:items-center lg:w-[79vw] pl-[5rem]! md:pl-[6rem]!">
      <div className="footer__info w-full lg:w-auto">
        <img src={footerImg} alt="footer" className="w-[10rem] h-[100%]" />
        <div className="flex w-full justify-between lg:w-[60vw] items-baseline flex-col sm:flex-row sm:pr-3! py-6! gap-4">
          <div className="flex justify-between w-full pr-3 sm:contents">
            <div className="footer__nav">
              <span>Navigation:</span>
              <Nav />
            </div>
            <div className="footer__checkout flex-col flex">
              <span>Checkout:</span>
              <a href="tel:+38(099)9648090">+38 (099) 964 80 90</a>
              <a href="tel:+38(099)9648090">+38 (099) 964 80 90</a>
              <a href="tel:+38(099)9648090">+38 (099) 964 80 90</a>
            </div>
          </div>
          <div className="footer__work">
            <span>Working hours:</span>
            <p>from 11:00 to 22:45</p>
          </div>
        </div>
        <span>© Ninja Sushi by Yaro. All rights reserved.</span>
        <h5>Privacy policy</h5>
      </div>
    </div>
  );
}

export default Footer;
