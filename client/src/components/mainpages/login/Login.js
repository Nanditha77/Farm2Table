import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'  // kyunki hame try karna hai login karke password ko send bhi karna hai na
//  ki login hua hai post karke

const Login = () => {
  const [user,setUser] = useState({
    email:'',
    password:''
  })
  const [role, setRole] = useState('User');

  const onChangeInput = e =>{
    const {name,value} = e.target;
    setUser({...user,[name]:value})
  }

  const loginSubmit = async e =>{
    e.preventDefault();
    try{
            await axios.post('https://farm2table-production.up.railway.app/user/login',{...user,role}); //user ko bejna hai post request pe

            localStorage.setItem('firstLogin',true)// first login ko true kar dete hai

            window.location.href = "/"  //vapas esi location pahunchadiya jo ki home  location tha 
    }
    catch(eror){
      alert(eror.response.data.msg)
    }
  }

  return (
    <div className='login-page'>
      <form onSubmit={loginSubmit}>
        <input type='email' name='email' required placeholder='Email' value={user.email} onChange={onChangeInput}/>
        <input type='password' name='password' required placeholder='Password' value={user.password} onChange={onChangeInput} />
        <label className="block text-sm font-medium text-gray-700 mb-1">Want to sell or Buy?</label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="Farmer"
              checked={role === 'Farmer'}
              onChange={(e) => setRole(e.target.value)}
            />
            <span>Farmer</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="User"
              checked={role === 'User'}
              onChange={(e) => setRole(e.target.value)}
            />
            <span>Customer</span>
          </label>
        </div>

        <div className='row'>
          <button type='submit'>Login</button>
          <Link to='/register'>Register</Link>
        </div>
      </form>
    </div>
  )
}

export default Login