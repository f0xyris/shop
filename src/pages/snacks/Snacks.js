import React from 'react'
import ProductItems from '../../components/productItems/ProductItems'

function Snacks() {
    return (
        <div className="content">
            <ProductItems 
                collectionName = 'snacks'
                activeSlider = {false}
                button = {false}
            />
        </div>
        
    )
}

export default Snacks
