import React from 'react'
import MenuItem from '../menuItem/MenuItem';
import './Cats.css';

import burr from '../../images/burr.svg';
import drinks from '../../images/drinks.svg';
import roll from '../../images/roll.svg';
import set from '../../images/set.svg';
import sia from '../../images/sia.svg';
import sushi from '../../images/sushi.svg';

function Cats() {
    return (
        <div className="cats">
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
    )
}

export default Cats
