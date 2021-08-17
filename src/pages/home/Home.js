import React from 'react'
import Slide from '../../components/slide/Slide'
import './Home.css'

import spec1 from '../../images/spec1.svg'
import spec2 from '../../images/spec2.svg'
import spec3 from '../../images/spec3.svg'
import spec4 from '../../images/spec4.svg'
import SpecialItem from '../../components/specialItem/SpecialItem'
import ProductItems from '../../components/productItems/ProductItems'

function Home() {


    return (
        <div className="home">
            
                <div className="home__content content">
                    <Slide />
                    <div className="home__items">
                        <SpecialItem
                            image =  {spec1}
                            title = "Fresh made"
                            desc = "We guarantee freshness of products and do not use frozen fish"
                        />
                        <SpecialItem
                            image =  {spec2}
                            title = "Chef recipes"
                            desc = "We offer both classic sushi and original recipes from the chef"
                        />
                        <SpecialItem
                            image =  {spec3}
                            title = "Quality ingredients"
                            desc = "We do not use flavor enhancers. All products are purchased from trusted suppliers"
                        />
                        <SpecialItem
                            image =  {spec4}
                            title = "Clean kitchen"
                            desc = "The whole cooking process takes place in accordance with all sanitary standards"
                        />
                    </div>
                    <div className="home__topPos">
                        <h1>Top positions</h1>
                        <p>The Ninja Sushi assortment includes rolls, sushi, sets and drinks for every taste. We recommend you definitely try the top positions of our menu!</p>
                        <ProductItems 
                            collectionName = "rolls"
                            activeSlider
                            button
                        />
                        <ProductItems 
                            collectionName = "sushi"
                            activeSlider
                            button
                        />
                        <ProductItems 
                            collectionName = "sets"
                            activeSlider
                            button
                        />
                        <ProductItems 
                            collectionName = "snacks"
                            activeSlider
                            button
                        />
                        <ProductItems 
                            collectionName = "drinks"
                            activeSlider
                            button
                        />
                        
                    </div>
                </div>
            
        </div>
    )
}

export default Home
