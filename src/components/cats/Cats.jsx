import React from "react";
import MenuItem from "../menuItem/MenuItem";
import "./Cats.css";

import burr from "../../images/burr.svg";
import drinks from "../../images/drinks.svg";
import roll from "../../images/roll.svg";
import set from "../../images/set.svg";
import sia from "../../images/sia.svg";
import sushi from "../../images/sushi.svg";

function Cats() {
  const menuItems = [
    { title: "rolls", image: roll },
    { title: "sushi", image: sushi },
    { title: "sets", image: set },
    { title: "snacks", image: burr },
    { title: "drinks", image: drinks },
    { title: "sauces", image: sia },
  ];
  return (
    <div className="cats">
      {menuItems.map((item) => (
        <MenuItem key={item.title} title={item.title} image={item.image} />
      ))}
    </div>
  );
}

export default Cats;
