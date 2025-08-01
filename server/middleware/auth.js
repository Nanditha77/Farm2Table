const jwt = require('jsonwebtoken');

const auth = (requ,resp,next) =>{  //next pass karthe hai thaki ham log next middleware thakki perform kar sake
    try{
        const token = requ.header("Authorization");
        if(!token) return resp.status(400).json({msg:"Invalid authentication"})

            jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(eror,user)=>{
                if(eror) return resp.status(400).json({msg:"Invalid Authentication"})

                requ.user = user;
                next();  //middleware ke liye next wala perform ho jaye 
            })
    }
    catch(eror){
                return resp.status(500).json({msg:eror.message});
    }
} //authorization ke liye

module.exports = auth;