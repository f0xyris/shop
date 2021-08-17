import React from 'react'
import ProductItems from '../../components/productItems/ProductItems'

function Sushi() {
    return (
        <div className="content">
            <ProductItems 
                collectionName = 'sushi'
                activeSlider = {false}
                button = {false}
            />
        </div>
        
    )
}

export default Sushi
