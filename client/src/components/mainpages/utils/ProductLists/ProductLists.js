import { useContext } from "react";
import BtnRender from "./BtnRender";
import { GlobalState } from "../../../../GlobalState";

const ProductLists = ({ product }) => {
  const state = useContext(GlobalState);
  const [selected] = state.ProductAPI.selected;

  const { vegie, fruit } = selected;

  // Show only based on selected filter
  if (vegie && product.category !== "Vegetables") return null;
  if (fruit && product.category !== "Fruits") return null;

  // If neither is selected, show everything
  return (
    <div className='product_card'>
      <img src={product.images.url} alt='' />
      <div className='product_box'>
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>
      <BtnRender product={product} />
    </div>
  );
};

export default ProductLists;
