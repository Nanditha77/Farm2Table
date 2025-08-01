const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct",  // Free + fast model
        messages: [
          { role: "system", content: "You are FarmBot, a farm-to-table assistant. Answer clearly in exactly 17 words. Help with orders, delivery (refer to History page), payment, products in stock (radish, potato, cauliflower, apple, watermelon, strawberry, orange, chilli, beetroot, tomato, carrot). For growing tips, tell users to search that product in the search bar. Be helpful." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenRouter error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch AI reply' });
  }
});

module.exports = router;