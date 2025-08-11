import React from "react";
import ProductItems from "../../components/productItems/ProductItems";

function Sauces() {
  return (
    <div className="content w-[100vw] lg:w-[69vw] xl:w-[67vw]">
      <ProductItems
        collectionName="sauces"
        activeSlider={false}
        button={false}
      />
    </div>
  );
}

export default Sauces;
