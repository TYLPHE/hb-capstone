import { useLoaderData, Link } from "react-router-dom"
import './Users.css';

export default function Users() {
  const { users } = useLoaderData();

  return <>
    <h1>All Users</h1>
    <table>
      <tbody>
        {users.map((user) => {
          return <tr key={user.id}>
            <td id={user.id}>
              <Link to={`/dashboard/${user.id}`} className="user-link">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </Link>
            </td>
          </tr>
        })}
      </tbody>
    </table>
  </>
}