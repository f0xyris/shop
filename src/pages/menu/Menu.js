import React from 'react'
import MenuItem from '../../components/menuItem/MenuItem';
import './Menu.css';

import roll from '../../images/menu/cat1.png';
import sushi from '../../images/menu/cat2.png';
import set from '../../images/menu/cat3.png';
import burr from '../../images/menu/cat4.png';
import drinks from '../../images/menu/cat5.png';
import sia from '../../images/menu/cat6.png';

function Menu() {
    return (
        <div className="content menu-wrapper">
            <h1>Menu</h1>
            <div className="menu">
           <MenuItem 
            title="rolls"
            image={roll}
           />
           <MenuItem 
            title="sushi"
            image={sushi}
           />
           <MenuItem 
            title="sets"
            image={set}
           />
           <MenuItem 
            title="snacks"
            image={burr}
           />
           <MenuItem 
            title="drinks"
            image={drinks}
           />
           <MenuItem 
            title="sauces"
            image={sia}
           />
        </div>
        </div>
    )
}

export default Menu
