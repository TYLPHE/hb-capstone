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
import Review from './pages/Review/Review';
import SearchResults from './pages/SearchResults/SearchResults';
import ReviewEdit from './pages/ReviewEdit/ReviewEdit';
import ReviewDelete from './pages/ReviewDelete/ReviewDelete';

const router = createBrowserRouter([
  {
    path:'/',
    element: <Welcome />,
    loader: async () => {
      const req = await fetch('/login-status');
      const res = await req.json();
      if (res.user_id) return redirect('/dashboard');
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
    loader: async () => {
      const request = await fetch('/random-games')
      const response = await request.json()
      return response
    }
  },
  {
    path:'/games/:id/:game_name',
    element: <GameDetails />,
    loader: async ({ params }) => {
      const game_id = params.id;
      const game_name = params.game_name;
      const request = await fetch(`/games/${game_id}/${game_name}`) ;
      const response = await request.json();
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
        return redirect ('/');
      }
      
      return response;
    }
  },
  {
    path:'/review/:id',
    element: <Review />,
    loader: async ({ params }) => {
      const request = await fetch(`/review-data/${ params.id }`);
      const response = await request.json();
      return response;
    }
  },
  {
    path: '/games/search-results',
    element: <SearchResults />,
  },
  {
    path: '/review/edit/:id',
    element: <ReviewEdit />,
    loader: async ({ params }) => {
      const request = await fetch(`/review-edit?id=${ params.id }`)
      const response = await request.json();
      return response;
    }
  },
  {
    path: 'review/delete/:id',
    element: <ReviewDelete />,
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
