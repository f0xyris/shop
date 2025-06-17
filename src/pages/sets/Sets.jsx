import React from "react";
import ProductItems from "../../components/productItems/ProductItems";

function Sets() {
  return (
    <div className="content w-[100vw] lg:w-[70vw] xl:w-[68vw]">
      <ProductItems collectionName="sets" activeSlider={false} button={false} />
    </div>
  );
}

export default Sets;
