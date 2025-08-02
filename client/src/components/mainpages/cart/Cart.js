import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'

import { Link } from 'react-router-dom';

const Cart = () => {
  const state = useContext(GlobalState);
  const [cart] = state.UserAPI.cart

  if(cart.length===0) 
    return <h2 style={{textAlign:'center',fontSize:"5rem"}}>Cart Empty</h2>
    
  return (
    <div> 
        { cart.map(product => (
               <div className='detail'>
        <img src={product.product.images.url} style={{width: '100%', height: 'auto'}} alt=''/>
        <div className='box-detail'>
            <div className='row'>
               <h2>{product.product.title}</h2>
            </div>
            <span>${product.product.price}</span>
            <p>{product.product.description}</p>
            <Link to='/payment' state={{product}} className='cart'>Buy Now</Link>
        </div>
    </div>
         ))}
    </div>
  )
}

export default Cart