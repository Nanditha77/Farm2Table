//har ek particular user cart mein kuch na kuch add karega, 
//jaise ham ne productapi ke liye banaya hamne api wala waise ham userapi bana rahe hai

import { useEffect, useState } from 'react'
import axios from 'axios'

const UserAPI = (token) => {
      // login logout rakh lete hai yaha pe, logged in as user admin hai ki nahi, user cart dekh the hai 
    const [isLogged,setIsLogged] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);
    const [userEmail,setUserEmail] = useState('');
    const [cart,setCart] = useState([]);

    useEffect(()=>{   //user ki info chahiye
           if(token){
            const getUser = async ()=>{
              try{
                     const resp = await axios.get('https://farm2table-production.up.railway.app/user/infor',{
                      headers:{Authorization:token}
                     });
             //token hai matlab user hai, us user ke cart pe dikhana padega unka item, so infor lethe hai

             setIsLogged(true);  //agar token hai toh islogged true ho jayega
             resp.data.role==='Farmer' ? setIsAdmin(true): setIsAdmin(false)
             setUserEmail(resp.data.email);

             console.log(resp);
              }
              catch(eror){
                alert(eror.response.data.msg)
              }
            }
            getUser();
          }
    },[token])  

  useEffect(() => {
    if (userEmail) {
      const saved = localStorage.getItem(`cart_${userEmail}`);
      setCart(saved ? JSON.parse(saved) : []);
    }
  }, [userEmail]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    }
  }, [cart]);

    const addCart =  (product) =>{  //  product ko addcart karna hai
        if(!isLogged) return alert("Please Login")

          console.log(product);
          
    const check = cart.every(item =>  item.product._id !== product.product._id )  //means ham agar jo item add kardenge usko baad mein nahi dikhane ki wo item fir se add hogaya)
    console.log(cart);
    if(check){
      setCart([...cart, {...product,quantity:1}])
    }else{
      alert("This product has been already to cart")
    }
  }

  return {
      isLogged:[isLogged,setIsLogged],
      isAdmin:[isAdmin,setIsAdmin],
      cart:[cart,setCart],
      addCart:addCart,
      userEmail : [userEmail, setUserEmail]
  }
}


export default UserAPI