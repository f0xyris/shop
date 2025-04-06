import React from 'react'
import ProductItems from '../../components/productItems/ProductItems'

function Favorites() {
    return (
        <div className="content">
            <h1>Favorites</h1>
            <ProductItems 
                collectionName = 'all'
                activeSlider = {false}
                button = {false}
                showFavs
                hideTitle
                />
        </div>
    )
}

export default Favorites
