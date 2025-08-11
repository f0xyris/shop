import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import ProductItems from "../../components/productItems/ProductItems";
import Sortbar from "../../components/sortbar/Sortbar";
import { showSortedItems } from "../../features/sort/sortSlice";

function Rolls() {
  const [searchParams] = useSearchParams();

  const sortedItems = useSelector(showSortedItems);

  const sortParam = searchParams.get("sort") || "All";

  return (
    <div className="content w-[100vw] lg:w-[69vw] xl:w-[67vw]">
      <Sortbar />
      <ProductItems
        collectionName="rolls"
        items={sortedItems}
        activeSlider={false}
        button={false}
      />
    </div>
  );
}

export default Rolls;
