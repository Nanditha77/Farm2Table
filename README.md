# Farm2Table

<img width="1324" height="692" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/7f650dbd-3531-49d7-bf8a-64e9e39db42c" />

**About**

Farm2Table is a full-stack web application that connects local farmers directly with consumers, enabling the sale of fresh, organic produce through a secure and user-friendly platform.

**🚀 Features**

**👩‍🌾 For Farmers**
- Register/login securely
- List and manage harvest products
- View sales and product dashboard and manage deliveries

**🛒 For Buyers**
- Browse and filter products by category
- Search with autocomplete
- Add to cart and checkout using Stripe
- Enter delivery address at checkout
- View order history

**🔐 Authentication**
- JWT-based user login with role-based access
- Admin dashboard for managing users, products, and orders

**🤖 Chatbot**
- Integrated GPT-style chatbot using OpenRouter API(mistralai) to assist users with product, delivery queries and farming tips


__Languages and Framerwork used:__

- JavaScript, HTML, CSS, Tailwind CSS
- Frontend : ReactJs, React Router, Axios
- Backend: Express, Node.js, Mongoose
- MongoDB Atlas: A cloud NoSQL database used to store movie data efficiently.
- Deployment: Vercel (frontend), Render (backend)  

- Created a .env file in server & client with required keys for security.  

__Installation__  

- Clone the repository:  

git clone https://github.com/Nanditha77/Farm2Table.git  
cd Farm2Table  

- Install backend dependencies:  

cd server  
npm install   

- Install frontend dependencies:  

cd client  
npm install   

- Connect backend to Mongodb Atlas by using MONGO_URI key in .env with value from Atlas.  

- Start the backend server:  

cd server  
npm run dev  

- Start the frontend server:  

cd client  
npm start  

__Usage__  
Navigate to https://farm2table-client.vercel.app/ to use the application.  

