import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
// import App from './App';
import Login from './components/login';
import Categories from './components/categories';
import Posts from './components/posts';
import { Container } from '@mui/system';
import SideBar from './components/sidebar';
const routs = (
  <Container>
   < BrowserRouter >
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/admin/categories" element={ <Categories /> } />
         <Route path="/admin/posts" element={ <Posts /> } />
         <Route path="/user" element={ <SideBar /> } /> 
         {/* <Route path="/dashboard" element={ <Dashboard /> } /> */}
         
      </Routes>
   </ BrowserRouter >
   </Container>
);
ReactDOM.render(routs, document.getElementById('root'))

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
