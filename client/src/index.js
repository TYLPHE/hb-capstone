import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorBoundary from './pages/ErrorBoundary';

const router = createBrowserRouter([
  {
    path:'/',
    element: <Welcome />,
    loader: async () => {
      const req = await fetch('/login-status');
      const res = await req.json();
      if (res.user_id) {
        return redirect('/dashboard');
      }
      return null;
    },
    errorElement: <ErrorBoundary />,
  },
  {
    path:'/login',
    element: <Login />
  },
  {
    path:'/register',
    element: <Register />
  },
  {
    path:'/dashboard',
    element: (
        <Dashboard />
    )
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
