import React, { useCallback } from 'react'
import './Sortbar.css'
import { useDispatch, useSelector } from 'react-redux'
import { showAllProducts } from '../../features/cart/cartSlice'
import { toggleSortedItem } from '../../features/sort/sortSlice'

const state = ['All', 'Classic', 'Maki', 'Dragons', 'Baked', 'Felix', 'Sweet']

function Sortbar() {
    const products = useSelector(showAllProducts)
    const dispatch = useDispatch()

    const sortItem = useCallback((sItem) => {
        let sortedItems = [];

        if(sItem === 'All' && products.type) {
            sortedItems = products;
        } else {
            sortedItems = products.filter(item => item.type === sItem.toLowerCase());
        }

        sortedItems = sortedItems.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id
            ))
        );

        dispatch(toggleSortedItem(sortedItems))

    }, [products , dispatch])


    const sortedItems = state.map((item) => {
        return <li key = {item} onClick = {() => sortItem(item)}>{item}</li>
    })

    return (
        <ul className="sort-nav">
            {sortedItems}
        </ul>
    )
}

export default Sortbar
