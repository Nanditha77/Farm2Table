const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({  //user bana rahe toh userschema
      name:{
        type:String,
        required:true,
      },
      email:{
        type:String,
        unique:true
      },
      password:{
        type:String,
        required:true
      },
      role:{  //good practice to take role, role mein hamesha number mein dikhayenge type
        type:'String',
        default:0 //default mein number user ka hoga 0, koi adminstrator hai bhi nahi
      },
      cart:{
        type:Array,  //card mein bohot saare chij add karega toh type eska array de dete hai
        default:[]
      } 
},{
    timestamps:true   //ese pata chalta hai ki created kab hai
})

module.exports = mongoose.model('Users',userSchema)