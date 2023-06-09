import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import Dashboard from './pages/Dashboard/Dashboard';
import Signin from './pages/Signin/Signin';
import Register from './pages/Register/Register';
import ErrorBoundary from './pages/ErrorBoundary/ErrorBoundary';
import Games from './pages/Games/Games';
import Library from './pages/Library/Library';
import GameDetails from './pages/GameDetails/GameDetails';
import Review from './pages/Review/Review';
import SearchResults from './pages/SearchResults/SearchResults';
import ReviewEdit from './pages/ReviewEdit/ReviewEdit';
import ReviewDelete from './pages/ReviewDelete/ReviewDelete';
import Authenticated from './layout/Authenticated';
import NoMatch from './pages/NoMatch/NoMatch';
import Users from './pages/Users/Users'

const router = createBrowserRouter([
  {
    path:'/',
    element: <Welcome />,
    errorElement: <ErrorBoundary />,
  },
  {
    path:'/signin',
    loader: async () => {
      const request = await fetch('/api/user/session-status');
      if (request.ok) {
        return redirect('/dashboard');
      }

      return null;
    },
    element: <Signin />
  },
  {
    path:'/register',
    element: <Register />
  },
  {
    element: <Authenticated />,
    children: [
      {
        path:'/dashboard',
        element: <Dashboard />,
        loader: async () => {
          const requests = await Promise.all([
            await fetch('/api/user/session-status'),
            await fetch('/api/follow/all'),
            await fetch('/api/follow/random-review'),
            await fetch('/api/library/data'),
          ].map(async (res) => {
            const response = await res.json()
            return response
          }));

          const response = {}
          requests.forEach((data) => {
            for (const [key, value] of Object.entries(data)) {
              response[key] = value;
            }
          });

          return response
        }
      },
      {
        path:'/dashboard/:id',
        element: <Dashboard />,
        loader: async ({ params }) => {
          const requests = await Promise.all([
            await fetch('/api/user/session-status'),
            await fetch(`/api/follow/all/${params.id}`),
            await fetch('/api/follow/random-review'),
            await fetch(`/api/library/data/${params.id}`),
          ].map(async (res) => {
            const response = await res.json()
            return response
          }));

          const response = {}
          requests.forEach((data) => {
            for (const [key, value] of Object.entries(data)) {
              response[key] = value;
            }
          });

          return response
        }        
      },
      {
        path:'/games',
        element: <Games />,
        loader: async () => {
          const request = await fetch('/api/games/random-games')
          const response = await request.json()
          return response
        }
      },
      {
        path:'/games/:id/:game_name',
        element: <GameDetails />,
        loader: async ({ params }) => {
          const game_id = params.id;
          const request = await fetch(`/api/games/${game_id}`) ;
          if (request.ok) {
            const response = await request.json();
            return response;
          } else {
            console.error('Loader error: path: "/games/:id/:game_name"');
            return null;
          }
        }
      },
      {
        path:'/review/:id',
        element: <Review />,
        loader: async ({ params }) => {
          const request = await fetch(`/api/review/${ params.id }`);
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
          const request = await fetch(`/api/review/edit/${ params.id }`)
          const response = await request.json();
          return response;
        }
      },
      {
        path: '/review/delete/:id',
        element: <ReviewDelete />,
      },
      {
        path: '/users',
        element: <Users />,
        loader: async () => {
          const request = await fetch('/api/user/all')
          if (request.ok) {
            const response = await request.json()
            return response
          } else {
            return console.error('/api/user/all error')
          }
        }
      },
    ]
  },
  {
    path: '*', // For any other URL, "Page does not exist."
    element: <NoMatch />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
