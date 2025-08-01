import React from 'react'
import { GlobalState } from '../../../../GlobalState'
import { Link } from 'react-router-dom'
import { useContext } from 'react'

const BtnRender = (product) => {

    const state = useContext(GlobalState)
  const [isAdmin] = state.UserAPI.isAdmin
  const addCart = state.UserAPI.addCart
  const deleteProduct = state.ProductAPI.deleteProduct

  return (
     <div className='row_btn'>
        {
          isAdmin ? 
          <>
            <Link id='btn_buy' onClick={()=>deleteProduct(product)} >
              Delete
            </Link>

            <Link id='btn_view' to={`detail/${product.product._id}`} >
               Edit
            </Link>
            </>
            :
            <>
            <Link id='btn_buy' to={`#!`} onClick={() =>addCart(product) }>
              Buy
            </Link>
            </>
        }
        </div>
  )
}

export default BtnRender