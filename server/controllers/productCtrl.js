const Products = require('../models/productModel')
const qs = require('qs');
const { v4: uuidv4 } = require('uuid');

//api ke fatures jo hai na filtering,sorting,pagination(pagination important because har ek page mein saare items nahi dikha sakthe hain)
// ye saare server side mein rakthe hai takhi hamara jo hai na ye yaha pe load kaafi jyada high hai

class APIfeatures{
    constructor(query,queryString){
        this.query = query;
        this.queryString= queryString;
    }

    filtering(){
            const queryObj = {...this.queryString}  // means queryString = requ.query
            // console.log(queryObj)  dekhenge ki ye sache hai kya queryObj = requ.query
            const excludedFields = ['page','sort','limit'] // isme jo thi na hame jo hatana hai wo dekh lete hai.
            //  ye backend se frotend pe karenge isliye hai hamare paas kaam kar raha hai abhi, lekin abhi bhi yahi pe bana lethe hai logic
            excludedFields.forEach(el => delete(queryObj[el])) //delete karke paas kardete hai, har ek queryObj aayenge inko hame delete karke paas karna hai
            console.log(queryObj) // dekhenge delete ke baad queryObj, page not showing now, bcoz page sort or limit nahi chahiye

            if (queryObj.title) {
              queryObj.title = { $regex: queryObj.title, $options: 'i' };
            }

            this.query = this.query.find(queryObj);


            return this
    }

    sorting(){
             if(this.queryString.sort){
                const sortBy = this.queryString.sort.split(',').join('')

                this.query = this.query.sort(sortBy)

                console.log(sortBy)
             }
             else{
                this.query =  this.query.sort('-createdAt')
             }
             return this;
    }

    pagination(){
          const page = this.queryString.page * 1 || 1; // ham log page number lenge from queryString, 
          // aur convert karenge usko number mein, aur in default isko 1 rakhenge, starting 1 page se shuru hoga

          const limit = this.queryString.limit *1 || 17; // no of items per page

          const skip = (page-1) *limit; // page mein se no of docs kitne skip karne padega, 
          // tabhi toh hame particular jis page pe pahuchenge usko saare items se dikanenge na 1 se har baar

          this.query = this.query.skip(skip).limit(limit); //this.query ko modify karenge jab hamne skip kardiya values uske saab se

          return this;
}
}

//pehle toh ham get karna hai toh filter karenge toh ham log ke paas yaha pe har ek features ko use karne wale hai 
// toh pehle toh ham try block pe laga dete hai get ke liye, features use karenge tab jaake ham get karenge or toh find karlenge
const productCtrl =  {
    getProducts : async (requ,resp) =>{
         try{
              const features = new APIfeatures(Products.find(),qs.parse(requ.query)).filtering().sorting().pagination()
              // const products = await Products.find(); ab yaha pe  hamare paas requ.query hogayi find karne ke liye product ab baaki ham yaha pe requ.json pe hamne pura likha hai line 
             // line, isko ham product.query likh sakthe hai 
             const products = await features.query // find toh ho hi rakha hai, ab features pe find ho rakha hai, toh features ke saath query likh dete hai na
            // apni query send karenge uske saab se sort kar sakthe hai ham log get karke na, matlab jis tarikhe ka product hame chahiye usko sort kar sakthe hai us query ke saab se
              resp.json({status:'success', result: products.length, products:products})
         }
         catch(eror){
            return resp.status(500).json({msg:eror.message})
         }
    },
    createProducts: async (requ,resp)=>{
        try{
              const {farmeremail,title,price,description,content,images,category} = requ.body;

              if(!images) return resp.status(400).json({msg:"No image upload"});

              const product = await Products.findOne({title}); 

              if(product) 
                return resp.status(400).json({msg:"This prodct already exists"});
              
              const newProduct = new Products({
                farmeremail,product_id: uuidv4(),title:title.toLowerCase(),price,description,content,images,category // title ko lower case karna padega
              })

              await newProduct.save();
              resp.json({msg:"Created a product"})
        }
        catch(eror){
            return resp.status(500).json({msg:eror.message})
        }
    },
    deleteProduct: async(requ,resp) =>{
        try{
              await Products.findByIdAndDelete(requ.params.id);
              resp.json({msg:"Deleted a product"});
        }
        catch(eror){
            return resp.status(500).json({msg:eror.message})
        }
    },
    updateProduct: async(requ,resp)=>{
        try{
              const {title,price,description,content,images,category} = requ.body; //product id will not change ever

              await Products.findByIdAndUpdate({_id:requ.params.id},{
                title:title.toLowerCase(),price,description,content,images,category
              })
              resp.json({msg:"Updated a product"})
        }
        catch(eror){
            return resp.status(500).json({msg:eror.message})
        }
    }
}


module.exports = productCtrl