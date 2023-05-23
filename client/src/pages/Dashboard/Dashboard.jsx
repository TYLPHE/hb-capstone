import { Link, useLoaderData } from "react-router-dom";
import './Dashboard.css';
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { username, following, followers } = useLoaderData();
  const [name, setName] = useState(username)
  const [fing, setFing] = useState(following)
  const [fers, setFers] = useState(followers)

  
  useEffect(() => {
    setName(username);
    setFing(following);
    setFers(followers);
  }, [username, following, followers])
  
  console.table(fers.users)
  function Followers() {
    return <div>
      <h2>{fing.count} following</h2>
      <table>
        <tbody>
          {fing.users.map((user) => {
            return <tr key={user.library_id}>
              <td>
                {user.user_name.charAt(0).toUpperCase() + user.user_name.slice(1)}
              </td>
            </tr>
          })}
        </tbody>
      </table>

      <h2>{fers.count} followers</h2>
      <table>
        <tbody>
          {fers.users.map((user) => {
            return <tr key={user.library_id}>
              <td>
                {user.user_name.charAt(0).toUpperCase() + user.user_name.slice(1)}
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  }
  
  return <>
    <h1>Welcome, { name }</h1>
    <div className="dashboard-buttons">
      <Link to='/library'>
        <button className='sign-register'>View My Library</button>
      </Link>
      <Link to='/games'>
        <button className='sign-register'>Browse Games</button>
      </Link>
      <Followers />
    </div>
  </>
}
