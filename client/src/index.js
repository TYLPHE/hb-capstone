import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ErrorBoundary from './pages/ErrorBoundary/ErrorBoundary';
import Games from './pages/Games/Games';
import Library from './pages/Library/Library';
import GameDetails from './pages/GameDetails/GameDetails';

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
    element: <Dashboard />,
    loader: async () => {
      const request = await fetch('/login-status');
      const response = await request.json();
      if (!response.user_id) {
        return redirect('/');
      }
      return response;
    },
    errorElement: <ErrorBoundary />,
  },
  {
    path:'/games',
    element: <Games />,
  },
  {
    path:'/games/:id/:game_name',
    element: <GameDetails />,
    loader: async ({ params }) => {
      const game_id = params.id;
      const game_name = params.game_name;
      const request = await fetch(`/games/${game_id}/${game_name}`) ;
      const response = await request.json();
      console.table(response)
      return response;
    }
  },
  {
    path:'/library',
    element: <Library />,
    loader: async () => {
      const request = await fetch('/library-data');
      const response = await request.json();
      if (response.status === 'Error') {
        redirect ('/dashboard');
      }
      return response
    }
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
