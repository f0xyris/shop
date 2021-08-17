import React from 'react'
import ProductItems from '../../components/productItems/ProductItems'

function Sauces() {
    return (
        <div className="content">
            <ProductItems 
                collectionName = 'sauces'
                activeSlider = {false}
                button = {false}
            />
        </div>
        
    )
}

export default Sauces
