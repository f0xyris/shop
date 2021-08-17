import {createSlice} from '@reduxjs/toolkit';


const initialCart = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialProducts = []

  export const cartSlice = createSlice({
    name: 'cartItems',
    initialState: {
        cartItems: initialCart,
        productItems: initialProducts
    },
    reducers: {
        addToCart: (state, {payload}) => {
            let newItem;
            
            const itemIndex = state.cartItems.findIndex(({title}) => title === payload.title)
            const item = state.cartItems[itemIndex]

            const prodIndex = state.productItems.findIndex(({title}) => title === payload.title);
            const prodItem = state.productItems[prodIndex]
            
            if(item) {
                newItem = {
                    ...payload,
                    count: item.count + 1,
                    price: parseInt(item.price) + parseInt(prodItem.price)
                }
            } else {
                newItem = {
                    ...payload, 
                    count: 1
                }
            }

            if(itemIndex >= 0) {
                return {
                    cartItems: [
                        ...state.cartItems.slice(0, itemIndex),
                        newItem,
                        ...state.cartItems.slice(itemIndex + 1),
                    ],
                    productItems: [...state.productItems]
                }
            } 
            
            state.cartItems.push(newItem)
            
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
            
        },
        delCounter: (state, {payload}) => {
            let newItem;
            const itemIndex = state.cartItems.findIndex(({title}) => title === payload.title)
            const item = state.cartItems[itemIndex]

            const prodIndex = state.productItems.findIndex(({title}) => title === payload.title);
            const prodItem = state.productItems[prodIndex]


            if(payload.count > 1) {
                if(item) {
                    newItem = {
                        ...payload,
                        count: item.count - 1,
                        price: parseInt(payload.price) - parseInt(prodItem.price)
                    }
                } else {
                    newItem = {
                        ...payload, 
                        count: 1
                    }
                }

                if(itemIndex >= 0) {
                    return {
                        cartItems: [
                            ...state.cartItems.slice(0, itemIndex),
                            newItem,
                            ...state.cartItems.slice(itemIndex + 1)
                        ],
                        productItems: [...state.productItems]
                    }
                }
            
                state.cartItems.push(newItem)

            } else {
                state.cartItems = state.cartItems.filter(({title}) => title !== payload.title);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        delFromCart: (state, {payload}) => {
            state.cartItems = state.cartItems.filter(({title}) => title !== payload.title);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        addProducts: (state , {payload}) => {
                payload.map((item) => {
                    return state.productItems.push(item);
                })
        }
    }
})


export const {addToCart, delFromCart, delCounter, addProducts} = cartSlice.actions;


export const showCartItems = state => state.cartItems.cartItems;
export const showAllProducts = state => state.cartItems.productItems;


export default cartSlice.reducer;