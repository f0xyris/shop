import React, { useCallback, useEffect, useState } from 'react'
import Button from '../button/Button'
import Slider from "react-slick";
import { db } from '../../firebase';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add, del, showFavorites } from '../../features/fav/favSlice';
import { addToCart, addProducts } from '../../features/cart/cartSlice';
import {showSortedItems} from '../../features/sort/sortSlice'

import './ProductItems.css'

function ProductItems ({collectionName, activeSlider, button, showFavs, hideTitle}) {
    

    let [products, setProducts] = useState([])
    let [mounted, setMounted] = useState(true)

    const favItem = useSelector(showFavorites)
    const sortedItems = useSelector(showSortedItems)

    const history = useNavigate()
    const dispatch = useDispatch()

    const fetchProducts = useCallback(async () => {
        try {
          const productsCollection = collection(db, collectionName); 
          const productsSnapshot = await getDocs(productsCollection); 
          const productsList = productsSnapshot.docs.map(doc => doc.data()); 
          setProducts(productsList); 
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      }, [collectionName]);
    
      useEffect(() => {
        fetchProducts();
      }, [fetchProducts]);
    
      useEffect(() => {
        dispatch(addProducts(products));
      }, [products, dispatch]);

    const settings = {
        dots: false,
        speed: 500,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        variableWidth: true,
        infinite: true,
        responsive: [
            {
              breakpoint: 2024,
              settings: {
                slidesToShow: 3
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1
            }
        }
    ]
}


const toggleFav = useCallback((index) => {
    const addItemIndex = favItem.findIndex(({title}) => title === products[index].title);
    const itemIndex = products[index].id;
    const docRef = doc(db, collectionName, itemIndex)
    
    if(addItemIndex < 0) {
        onSnapshot(docRef, { fav: true })
        
        dispatch(
            add(products[index])
            )
            setMounted(!mounted) 
        } else {
            onSnapshot(docRef, { fav: false })
            
            dispatch(
                del(products[index])
                )
                setMounted(!mounted)  
            } 
            
        }, [dispatch, favItem, products,mounted, collectionName])
        
        
        const addToCartList = useCallback((index) => {
            dispatch(
                addToCart(products[index])
                ) 
            }, [dispatch, products])
            
            
            useEffect(() => {
                
                const fetchProducts = async () => {
                    const querySnapshot = await getDocs(collection(db, collectionName));
                    setProducts(querySnapshot.docs.map(doc => doc.data()))
                }
                
                fetchProducts()
            }, [collectionName, mounted])

            useEffect(() => {
                dispatch(
                    addProducts(products)
                )
            })
            
            const truncate = (string, n) => {
                return string?.length > n ? string.substr(0, n - 1) + '...' : string;
            }
            
            
            
                if(showFavs) {
                        products = favItem
                }
                
                if(Object.keys(sortedItems).length > 0 && products !== sortedItems) {
                    products = sortedItems
                }
                
                const items = products.map((item, idx) => {
                    return (
                        <div 
                            className="productItems__item" 
                            key = {item.title} 
                            style = {activeSlider ? {width: 300} : {}}
                        >
                        <div className="productItems__image">
                            <img src={item.image} alt={item.title}/>
                            <div className="productItems__fav">
                                {<span onClick={() => toggleFav(idx)}>
                                    <i className={`fa fa-heart-o ${favItem.some(fav => fav.title === item.title) ? 'active' : ''}`} aria-hidden="true"></i>
                                </span>}
                            </div>
                            {item?.eco ? <div className="productItems__eco">
                                <span>
                                    <i className="fa fa-leaf" aria-hidden="true"></i>
                                </span>
                            </div> : null}
                            {item?.spicy ? <div className="productItems__spicy">
                                <span>
                                    <i className="fa fa-fire" aria-hidden="true"></i>
                                </span>
                            </div> : null}
                        </div>
                        <div className="productItems__cart">
                            <h4>{item.title}</h4>
                            <div className="productItems__desc">
                                <h5><span>{item.weight} g </span>{truncate(item.desc, 55)}</h5>
                            </div>
                            <div className="productItems__order">
                                <Button
                                    title = "Add to cart"
                                    type = "green"
                                    disabled = {false}
                                    action= {() => addToCartList(idx)}
                                />
                                <span>{item.price}<small> uah</small></span>
                            </div>
                        </div>
                    </div>
            )
    })

    return (
        <div 
            className="productItems" 
            style = {
                !activeSlider ? {display:'flex'} : {}
            }
        >       
                {hideTitle ? null : <h2>{collectionName}</h2>}
                

                {
                    button 
                ? 
                    <Button
                        action = {() => history(`/${collectionName}`)}
                        type = "orange"
                        title = {`All ${collectionName}`}
                        disabled = {false}
                    /> 
                : 
                    null
                }
                
                { activeSlider ? <Slider {...settings}> {items} </Slider> : items }

        </div>
    )
}


export default ProductItems
