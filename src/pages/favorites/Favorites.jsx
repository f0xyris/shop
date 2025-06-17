import React from "react";
import ProductItems from "../../components/productItems/ProductItems";

function Favorites() {
  return (
    <div className="content w-[100vw] lg:w-[70vw] xl:w-[68vw]">
      <h1>Favorites</h1>
      <ProductItems
        collectionName="allitems"
        activeSlider={false}
        button={false}
        showFavs
        hideTitle
      />
    </div>
  );
}

export default Favorites;
