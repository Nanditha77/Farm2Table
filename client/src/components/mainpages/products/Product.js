import { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import ProductLists from '../utils/ProductLists/ProductLists';

const Product = () => {
  const state = useContext(GlobalState); 
  const [products] = state.ProductAPI.products;
  const [isAdmin] = state.UserAPI.isAdmin;  //products mein bhi changes karega admin karega ya fir kuch bhi karega

  console.log(state)
  return (
    <div className='products'>
       {
          products.map(product =>{
            return <ProductLists key={product.id} product={product} isAdmin={isAdmin} />
          })
       }
    </div>
  )
}

export default Product