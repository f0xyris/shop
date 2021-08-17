import React from 'react'
import ProductItems from '../../components/productItems/ProductItems'

function Drinks() {
    return (
        <div className="content">
            <ProductItems 
                collectionName = 'drinks'
                activeSlider = {false}
                button = {false}
            />
        </div>
        
    )
}

export default Drinks
