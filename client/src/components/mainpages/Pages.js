import React from 'react'
import Product from './products/Product'
import Login from './login/Login'
import Register from './login/Register'
import Cart from './cart/Cart'
import { Route,Routes } from 'react-router-dom'
import DetailProduct from './utils/DetailProducts/DetailProduct'
import PaymentForm from './payment/PaymentForm';   
import SuccessPage from './payment/SuccessPage'; 
import History from '../mainpages/History/History';
import CreateProduct from './adminproductcreation/CreateProduct'

const Pages = () => {
  return (
    <Routes>
      <Route path='/' element={<Product/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/detail/:id' element={<DetailProduct/>}/>
      <Route path='/cart' element={<Cart/>}/>
       <Route path='/payment' element={<PaymentForm />} />   
      <Route path='/success/:id' element={<SuccessPage />} /> 
     <Route path='/history' element={<History/> }/>
     <Route path='/create_product' element={<CreateProduct/>} />
 
    </Routes>
  )
}

export default Pages