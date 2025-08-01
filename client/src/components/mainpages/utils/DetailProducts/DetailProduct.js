import  { useContext, useEffect, useState } from 'react'
import { useParams ,Link} from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'
import axios from 'axios'

const DetailProduct = () => {

    const params = useParams()  
    const state = useContext(GlobalState);
    const [products,setProducts] = state.ProductAPI.products;
    const [detailsProduct,setDetailProduct] = useState([])
    const updateProduct = state.ProductAPI.updateProduct;
    const [isAdmin] = state.UserAPI.isAdmin;
    
    const [editData, setEditData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    images: {}
  });

  useEffect(() => {
    if (params.id && products.length) {
      const product = products.find(p => p._id === params.id);
      if (product) {
        setDetailProduct(product);
        setEditData({
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          images: product.images
          
        });
      }
    }
  }, [params, products]);

  if (!detailsProduct || !detailsProduct.images) return <div>Loading...</div>;

  const handleChange = e => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateProduct(detailsProduct._id, editData);
      alert("Product updated successfully!");
      const res = await axios.get('/api/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error("Update failed:", err);
    }
  }; 

  return (

    <div className='detail'>
    {isAdmin ? (
  <form className='box-detail' onSubmit={handleSubmit}>
    <div className='row'>
      <input name='title' value={editData.title} onChange={handleChange} />

    </div>
    <input
      type='number'
      name='price'
      value={editData.price}
      onChange={handleChange}
    />
    <textarea
      name='description'
      value={editData.description}
      onChange={handleChange}
    />
    <input
      name='category'
      value={editData.category}
      onChange={handleChange}
    />
    <button className='cart' type='submit'>Update Product</button>
  </form>
) : (
        
        <div className='box-detail'>
            
            <h2>{detailsProduct.title}</h2>
            <div className='row'>
            <img  src={detailsProduct.images.url} style={{width: '100%', height: 'auto'}} alt=''/>
            </div>
            <span>${detailsProduct.price}</span>
            <p>{detailsProduct.description}</p>
            <Link to='/payment' state={{product:{product:detailsProduct}}} className='cart'>Buy Now</Link>
            <div class="description">
              <h5>
                At <strong>Farm2Table</strong>, we believe that food should be as natural as the earth it grows in. Our range of fresh fruits and vegetables comes straight from trusted local farmers who practice sustainable, chemical-free farming.
                <br></br>
                All our products are:
                <ul>
                  <li>100% organically grown – free from synthetic pesticides, fertilizers, and GMOs.</li>
                  <li>Harvested fresh – we pick produce at peak ripeness to preserve taste and nutrition.</li>
                  <li>Grown using traditional, eco-friendly methods – like composting, crop rotation, and natural pest control.</li>
                  <li>Irrigated with clean water sources, and nurtured without artificial enhancers.</li>
                  <li>Delivered farm-fresh to your doorstep – no middlemen, no warehouses, no delays.</li>
                </ul>
                <br></br>
                Whether it's juicy tomatoes, crisp spinach, or sweet mangoes, each item in your basket is a promise of transparency, traceability, and taste. Our goal? To nourish you and your family the way nature intended — straight from the farm, right to your table.
              </h5>
            </div>

        </div>
    )}
    </div>
  )
}

export default DetailProduct