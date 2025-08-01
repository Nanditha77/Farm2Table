const Users = require('../models/userModel')

const authAdmin = async (requ,resp,next) =>{
    try{
         const user = await Users.findOne({ // user jo hai uska id leke dekhna hai ki uska role admin hai ki nahi
           _id: requ.user.id
         })

         if(user.role === 'User') return resp.status(400).json({msg:"Admin resources Access denies"})
        
         next()  //otherwise ham next middleware pe aate hai 
    }
    catch(eror){
          return resp.status(500).json({msg:eror.message})
    }
}

module.exports = authAdmin