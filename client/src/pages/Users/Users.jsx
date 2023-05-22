import { useLoaderData } from "react-router-dom"

export default function Users() {
  const { users } = useLoaderData();

  return <>
    <h1>All Users</h1>
    <table>
      <tbody>
        {users.map((user) => {
          return <tr key={user.id}>
            <td id={user.id}>
              {user.username}
            </td>
          </tr>
        })}
      </tbody>
    </table>
  </>
}