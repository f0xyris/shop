import React from 'react'

import ProductItems from '../../components/productItems/ProductItems'
import Sortbar from '../../components/sortbar/Sortbar'

function Rolls() {

    return (
        <div className="content">
            <Sortbar />
            <ProductItems 
                collectionName = 'rolls'
                activeSlider = {false}
                button = {false}
            />
        </div> 
        
    )
}

export default Rolls
