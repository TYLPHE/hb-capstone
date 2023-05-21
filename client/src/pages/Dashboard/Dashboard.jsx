import { Link, useLoaderData } from "react-router-dom";
import './Dashboard.css';

export default function Dashboard() {
  const { username } = useLoaderData();

  return (
    <div>
      <div className="main-view">
        <h1>Welcome, { username }</h1>
        <div className="dashboard-buttons">
          <Link to='/library'>
            <button className='sign-register'>View My Library</button>
          </Link>
          <Link to='/games'>
            <button className='sign-register'>Browse Games</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
