const Category = require("../models/categoryModel");

const categoryCtrl = {
      getCategories:async (requ,resp) =>{
        try{
            const categories = await Category.find();
            resp.json(categories);
        }
        catch(eror){
            return resp.status(500).json({msg:eror.message});
        }
      },
      createCategory : async(requ,resp) =>{
        try{
              const {name} = requ.body;
              const category = await Category.findOne({name}) // category de dete hai jo name ke saab se depend karegi, category ko create karna hai yaha pe. Category pehle se hi hai banana ke jarurat hi nahi
              if(category) return resp.status(400).json({msg:"Category already exists"})

              const newCategory = new Category({name});
               
              await newCategory.save();
              resp.json({msg:"Created a category"})
        }
        catch(eror){
             return resp.status(500).json({msg:eror.message})
        }
      },
      deleteCategory: async(requ,resp) =>{
        try{
            await Category.findByIdAndDelete(requ.params.id);
            resp.json({msg:"Deleted a category"})
        }
        catch(eror){
           return resp.status(500).json({msg:eror.message})
        }
      },
      updateCategory: async(requ,resp) =>{
        try{
             const {name} = requ.body;   // hame kya karna hai category ko yaha pe name ko change karke karna hai
             await Category.findByIdAndUpdate({_id:requ.params.id},{name})

             resp.json({msg:"Updated"})
        }
        catch(eror){
              return resp.status(500).json({msg:eror.message})
        }
      }
}

module.exports = categoryCtrl