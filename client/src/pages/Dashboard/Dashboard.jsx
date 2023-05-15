import { Link, useLoaderData } from "react-router-dom"

export default function Dashboard() {
  const { username } = useLoaderData();

  return (
    <div>
      <h1>Welcome, { username }</h1>
      <Link to='/library'>
        <button className='sign-register'>View My Library</button>
      </Link>
      <Link to='/games'>
        <button className='sign-register'>Browse Games</button>
      </Link>
    </div>
  )
}
