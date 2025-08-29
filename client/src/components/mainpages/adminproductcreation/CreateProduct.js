import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.UserAPI.isAdmin;
  const [token] = state.token;
  const createProduct = state.ProductAPI.createProduct;

  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    farmeremail:'',
    title: '',
    price: '',
    description: '',
    content: '',
    category: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) return alert("No file selected.");

      if (file.size > 1024 * 1024) return alert("File too large.");
      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("Invalid file format.");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post('https://farm2table-production.up.railway.app/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token
        }
      });

      setImages(res.data); // { public_id, url }
      setLoading(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!images.public_id) return alert("No image uploaded.");

      await createProduct(
        { ...product, images }, // include image object
        token
      );
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Product creation failed.');
    }
  };

  if (!isAdmin) return <h2>Unauthorized</h2>;

  return (
    <div className='px-4 py-6 bg-gray-100 ml-800'>
      <h2 className='text-2xl font-bold'>Create New Product</h2>

      <form onSubmit={handleSubmit}>

        <div className='row'>
          <label><strong>Your Email: </strong></label>
          <input type='email' name='farmeremail' value={product.farmeremail} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label><strong>Product name: </strong></label>
          <input type='text' name='title' value={product.title} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label><strong>Price: </strong></label>
          <input type='number' name='price' value={product.price} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label><strong>Description: </strong></label>
          <input name='description' value={product.description} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label><strong>Content: </strong></label>
          <input name='content' value={product.content} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label><strong>Category: </strong></label>
          <input name='category' value={product.category} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label><strong>Upload Image: </strong></label>
          <input type='file' onChange={handleUpload} />
        </div>

        {images && images.url && (
          <div className='uploaded-img'>
            <img src={images.url} alt='Uploaded' style={{ height: '100px' }} />
          </div>
        )}

        <button type='submit'>Create Vegetable/Fruit</button>
      </form>
    </div>
  );
};

export default CreateProduct;
