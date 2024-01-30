import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Home from './components/home/home';
import Login from './components/login/login';
import TargetPost from './components/targetPost/targetPost';
import './index.css';
import Cookies from 'js-cookie';

const App = () => {
  const jwtToken: string = Cookies.get('token');
  const [token, setToken] = useState(jwtToken);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to='/mod/login' />,
    },
    {
      path: '/mod/posts',
      element: <Home token={token} setToken={setToken} />,
    },
    {
      path: '/mod/posts/:id',
      element: <TargetPost token={token} setToken={setToken} />,
    },
    {
      path: '/mod/login',
      element: <Login setToken={setToken} />,
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;
