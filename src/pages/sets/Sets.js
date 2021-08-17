import React from 'react'
import ProductItems from '../../components/productItems/ProductItems'

function Sets() {
    return (
        <div className="content">
            <ProductItems 
                collectionName = 'sets'
                activeSlider = {false}
                button = {false}
            />
        </div>
        
    )
}

export default Sets
