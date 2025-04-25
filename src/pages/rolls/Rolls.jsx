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

  useEffect(() => {
    // Removed log for displaying sorted items
  }, [sortParam, sortedItems]);

  return (
    <div className="content">
      <Sortbar />
      <ProductItems
        collectionName="rolls"
        items={sortedItems} // Pass sorted items to ProductItems
        activeSlider={false}
        button={false}
      />
    </div>
  );
}

export default Rolls;
