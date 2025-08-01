import React, { useContext, useState } from 'react'
import { MdOutlineMenu } from "react-icons/md";
import { MdClose } from 'react-icons/md';
import { MdOutlineAddShoppingCart } from "react-icons/md";
import {Link, useNavigate} from 'react-router-dom'
import { GlobalState } from '../../GlobalState';
import Chatbot from '../ChatBot';
import SearchBar from './SearchBar';
import Profile from './Profile';

const Header = () => {

  const state = useContext(GlobalState);
  const [isLogged,setIsLogged] = state.UserAPI.isLogged
  const [isAdmin,setIsAdmin] = state.UserAPI.isAdmin
  const [cart] = state.UserAPI.cart
  const [open, setOpen] = useState(false)
  const [selected,setSelected] =state.ProductAPI.selected
  const navigate = useNavigate();


   const loggedRouter = () =>{  // koi logged hai toh kya kar saktha hai, kuch e nahi ki usko speicfic admin bhi banna padega
    return (
      <>
          <li><Link><Chatbot/> </Link></li>
          <li><SearchBar className='search-bar' onSelect={(product) => { navigate(`/detail/${product._id}`) }} /></li> 
           <li><button className='category-select' style={{fontSize:"15px", textTransform:"uppercase"}} onClick={() => setOpen(!open)}>Category</button>

              {open && (
               <ul>
               <li>
                   <button onClick={() => setSelected({ vegie: true, fruit: false })}>Vegetables</button>
               </li>
               <li>
                   <button onClick={() => setSelected({ vegie: false, fruit: true })}>Fruits</button>
               </li>
               
               </ul>
              )}</li>
         <li><Profile/></li>
      </>
    )
  }

  return (
  
   <header>
       {!isAdmin && <div className="marquee-wrapper">
          <p className="marquee-text">Login as farmer to sell your harvests</p>
        </div>  }

         <div className='menu'>
              <MdOutlineMenu size={30} />
         </div>
         <div className='logo'>
              <h1>
                <Link to='/' style={{fontWeight:'bold'}}>{isAdmin ? 'Farmer': 'Farm2Table'}</Link>
              </h1>
         </div>

         <ul>
            <li><Link to="/">{isAdmin ? 'Products': 'Shop'}</Link></li>
            
            {
              isLogged ? loggedRouter() : <li><Link to="/login">Login or Register?</Link></li>
            }

            <li>
                <MdClose size={30} className='menu'/>
            </li>
         </ul>
         {
           (!isAdmin && isLogged ) &&  <div className='cart-icon'>
            <span>{cart.length}</span> {/* 0 hogaya product hamare paas, baaki ham dikhadenge cart mein kitne products hai */}
            <Link to='/cart'><MdOutlineAddShoppingCart size={30}/></Link>
         </div>
         }
        
   </header>
  )
}

export default Header
