const Users = require('../models/userModel');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const userCtrl = {
    register: async(requ,resp)=>{
        try{
              const {name,email,password}  = requ.body;

              const user= await Users.findOne({email}) // pehle se hi email ek registered ho toh phir dekhadegi ki ye toh email se pehle se id bana hua hai
              if(user) return resp.status(400).json({msg:"Email already registered"})

              if(password.length<6)
                return resp.status(400).json({msg:"Password should be atleast 6 character"});

              //Password encrption

              const passwordHash = await bcrypt.hash(password,10);

              const newUser = new Users({name,email,password:passwordHash});

              //save in mongodb atlas
              await newUser.save();

              //create jwt(json web token) to authenticate
              const accesstoken = createAccessToken({id:newUser._id, email: newUser.email});  // creating accesstoken id ke hisaab se(as id is unique)
              const refreshtoken = createRefreshToken({id:newUser._id, email: newUser.email});
              //ab refreshtoken ke saath ham yaha pe cookie le lethe hai, cookie hame secure way provide karega takhi ham transmit kar sake Refreshtoken ko, 
              //jabi ham cookie use karenge with HTTP only, toh ham bohot saare client side script mein bohot saare tab(type) ho sakthe hai jaise access ye sab secure rah saktha hai
            //saath mein web browser jo hai automatically handle kartha hai cookies hamare liye, jaise ki ham send kar rahe hai har ek request ke saath ek server pe 
            // saath mein ye hame easy rehta hai takhi ham manage kar sake REFRESHTOKEN ko without additonal client side logic, 
            // kabhi to saath mein ham set kar sakthe hai ek expression date ke saath kynuki hame control kar saktha hai kitne time baad takki REFRESHTOKEN ko valid rakna hai
            //cookie logic 
        
            resp.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token' //kis path pe kaam kar raha hai 
            })   //refreshtoken accpet karna padega hame cookie se toh refereshtoken ke liye alag hi request karke cookie ko accept karna padega 

            resp.json({accesstoken})

            }
        catch(eror){
            return resp.status(500).json({msg:eror.message})
        }
    },
     refreshtoken: async(requ,resp)=>{
        try{
             const rf_token = requ.cookies.refreshtoken
        if(!rf_token) return resp.status(400).json({msg:"Please login or register"});

        jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(eror,user)=>{
            if(eror) return resp.status(400).json({msg:"Please login or Register"}) ; //(yaha se wo error came, token nahi toh error came, access token nahi hai so, and rf token nahi hoga also so) if error comes while verifying
            const accesstoken = createAccessToken({id:user.id, email: user.email})
            resp.json({accesstoken});
        }) //rf_token ko jwt se verify kar lete hai
        
    }   // here that cookie accept continues 
        catch(eror){
          return resp.status(500).json({msg:eror.message});
        }
    },
    login: async(requ,resp) =>{
        try{
              const {email,password,role} = requ.body;
              const user = await Users.findOne({email});
              if(!user) return resp.status(400).json({msg:"User does not exist"})

              const isMatch = await bcrypt.compare(password,user.password);
              if(!isMatch) return resp.status(400).json({msg:"Incorrect password"});

              const accesstoken = createAccessToken({id:user._id, email: user.email})
              const refreshtoken = createRefreshToken({id:user._id, email: user.email})

              resp.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token',
                sameSite: 'none',               
                secure: true 
              })

              const  updated= await Users.findOneAndUpdate(
                    { email },
                    { role :role }
                  );
              resp.json({accesstoken});
        }
        catch(eror){
                return resp.status(500).json({msg:eror.message});
            }
    },
    logout: async(requ,resp)=>{
        try{
             resp.clearCookie('refreshtoken',{path:'/user/refresh_token',
                sameSite: 'none',  
                secure: true
             }); // 
             return resp.json({msg:"Logout"})
        }
        catch(eror){
             return resp.json({msg:"Log Out"})
        }
    },
    getUser: async(requ,resp) =>{
        try{
            const user = await Users.findById(requ.user.id).select('-password')

            if(!user) return resp.status(400).json({msg:"User not found"})
            resp.json(user) //jiss user se requ aa rahi hai oh dikha rahe hai
        }
        catch(eror){
             return resp.status(500).json({msg:eror.message})
        }
    },
}

const createAccessToken = (payload)  =>{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'}) // ab sign karne ke baad hamare paas   . secret code 2nd(taken from env), kisi bhi website se ham utake ek hard sa secret code likh sakthe hai but now easy one we write, expires in 1 day as esse authentication sahi rahti hai 
}//accesstoken jo mil raha hai uskeliye function bana dete hai
const createRefreshToken = (payload)  =>{
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'}) // ab sign karne ke baad hamare paas   . secret code 2nd(taken from env), kisi bhi website se ham utake ek hard sa secret code likh sakthe hai but now easy one we write, expires in 7 day as esse authentication sahi rahti hai 
}

module.exports = userCtrl