import { createContext, useEffect, useState } from "react";
import ProductAPI from "./api/ProductAPI";
import axios from 'axios' 
import UserAPI from "./api/UserAPI"
export const GlobalState = createContext()

export const DataProvider = ({children}) =>{

    const [token,setToken] = useState(false);

    const refreshToken = async () =>{
        try{
        const resp = await axios.get('/user/refresh_token')   //refreshtoken hame server mein userCtrl mein hai
        setToken(resp.data.accesstoken);
        }
        catch(eror){
              console.log("No refresh token, probably not logged in yet.");
        }
    }

    useEffect( ()=>{
        const firstLogin = localStorage.getItem('firstLogin');
        if(firstLogin) refreshToken();
    },[])

    const state = {
        token:[token,setToken],
        ProductAPI: ProductAPI(),
        UserAPI :UserAPI(token)
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
} // ye provider hai, yaha pe children pass karna hotha hai 

