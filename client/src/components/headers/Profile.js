import { useContext, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../GlobalState';
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const state = useContext(GlobalState);
  const [userEmail] = state.UserAPI.userEmail
  const [isLogged,setIsLogged] = state.UserAPI.isLogged
  const [isAdmin,setIsAdmin] = state.UserAPI.isAdmin

   const logoutUser = async () =>{
    await axios.get('https://farm2table-production.up.railway.app/user/logout')
    setIsAdmin(false);
    setIsLogged(false);
    window.location.reload();
  }

  return (
    <>
    <div className='profile-dropdown-content'>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          top: '16px',
          right: '165px',
          borderRadius: '50%',
          width: '37px',
          padding:'8px',
          height: '39px',
          fontSize: '21px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        <FaUser />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: '90px',
            right: '20px',
            width: '300px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            zIndex: 9999,
            overflowY: 'auto', 
            pointerEvents: 'auto',
            fontFamily: `'Poppins', sans-serif`,
            lineHeight: '1.6'
          }}
        >
          <div style={{ marginBottom: '10px', fontSize: '14px', minHeight: '40px' }}>
             <h5>{userEmail}</h5>
             <li style={{display:"block"}}><Link to='/history'>{isAdmin ? 'My Harvest sales' : 'History'}</Link></li>
             <li style={{display:"block"}}>{isAdmin && ( <Link to='/create_product'>Create Product</Link> ) }</li>
             <li><Link to='/' onClick={logoutUser}>Logout</Link></li>
          </div>
        </div>
       
      )}
       </div>
    </>
  );
};

export default Profile;