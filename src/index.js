import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, useRoutes } from "react-router-dom"; 
//import { BrowserRouter, useRoutes } from "react-router-dom";
import AppRoute from './routes/app-route.jsx';
import { AuthProvider } from './context/authContext.jsx';

// bootstrap // css
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './index.css';
import './scss/react.scss';


const container = document.getElementById('root');
const root = createRoot(container);
function App() {
	let element = useRoutes(AppRoute);
	
	return element;
}

root.render(
    <HashRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>
//  <BrowserRouter>
//    <AuthProvider>
//      <App />
//    </AuthProvider>
//  </BrowserRouter>
);
