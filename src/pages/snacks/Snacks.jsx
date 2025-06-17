import React from "react";
import ProductItems from "../../components/productItems/ProductItems";

function Snacks() {
  return (
    <div className="content w-[100vw] lg:w-[72vw] xl:w-[68vw]">
      <ProductItems
        collectionName="snacks"
        activeSlider={false}
        button={false}
      />
    </div>
  );
}

export default Snacks;
