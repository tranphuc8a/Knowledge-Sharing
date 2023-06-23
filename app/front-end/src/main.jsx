import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import MyRoute from './components/router/route.jsx'
import GetAPI from './services/api/get-api.js'
import PostAPI from './services/api/post-api.js'


// let callAPI = async () => {
//   let url = "http://localhost:3000/api/auth/login";
//   try {
//     let data = {
//       email: 'phuctv@gmail.com',
//       password: '12345678'
//     }
//     let res = await PostAPI.getInstance()
//       .setURL(url).setData(data).execute();
//     console.log(res);
//   } catch (e){
//     console.log(e);
//   }
// }

// callAPI();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyRoute />
  </React.StrictMode>,
)
