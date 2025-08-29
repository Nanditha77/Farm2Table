import { useEffect, useState } from 'react'
import axios from 'axios'


const ProductAPI = () => {

    const [products,setProducts] = useState([])
    const [callback, setCallback] = useState(false);
    const [selected, setSelected] = useState({
    vegie:false,
    fruit:false
  })

    const getProducts = async () =>{
        const resp = await axios.get('https://farm2table-production.up.railway.app/api/products')  //hame us local host se ye chahiye jo hamare yaha pe server side pe chal raha hai, server side pe hamare paas,
              //  server 5000 port pe run kar raha hai, client 3000port pe run kar raha hai, agar mein pakcage.json mein proxy banaunga  
       setProducts(resp.data.products)  //product get karne ke liye request kar rahe haiapi bana hai hamare paas es tarike se he showed above line while saying  
    } // isiliye maine apko pehle frontend dikhaya tha kyunki muje dikhana tha kaise ham get set karlenge agar apke paas koi backend pada ra hua pehle se hi toh
    
    const deleteProduct = async (product) =>{
      const resp = await axios.delete(`https://farm2table-production.up.railway.app/api/products/${product.product._id}`);
      alert(resp.data.msg);
      getProducts();
    }

    const updateProduct = async (productId, updatedData) =>{
  try {
    const res = await axios.put(`https://farm2table-production.up.railway.app/api/products/${productId}`, updatedData);
    alert(res.data.msg);
  } catch (err) {
    alert(err.response?.data?.msg || "Update failed");
    console.error(err);
  }
};

const createProduct = async (newProductData, token) => {
  try {
    const res = await axios.post('https://farm2table-production.up.railway.app/api/products', newProductData, {
      headers: { Authorization: token }
    });
    alert(res.data.msg);
    setCallback(prev => !prev); // triggers product list refresh
  } catch (err) {
    alert(err.response?.data?.msg || 'Error creating product');
  }
};


    useEffect( ()=>{
      getProducts();
    },[callback]) // api se fetch kar rahe hai, useeefect se function ko call karenge, jaise page reload hoga ham getproducts() ke saath kaam karenge
  
  return {
    products :[products,setProducts],   // he said by looking above code and all and said aise jagah pe contextApi,
    //  kyunki hame bahot saare proxy pass karna padega
    deleteProduct: deleteProduct,
    updateProduct:updateProduct,
    createProduct:createProduct,
    selected: [selected,setSelected]
    
  }
}

export default ProductAPI
