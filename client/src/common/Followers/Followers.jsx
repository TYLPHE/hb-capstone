// Params: arrays for following (arr) and followers (arr)
import { Link } from 'react-router-dom';
import './Followers.css'

export default function Followers(params) {
  const { fing, fers } = params;
  return <div className='followers-container'>
    <details className='followers-details'>
      <summary className='summary-following-title'>{fing.count} following</summary>
      <table className="follow-table">
        <tbody>
          {fing.users.map((user) => {
            return <tr key={`following${user.library_id}`}>
              <td>
                <Link to={`/dashboard/${user.library_id}`} className="follow-link">
                  {user.user_name.charAt(0).toUpperCase() + user.user_name.slice(1)}
                </Link>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </details>
    <details className='followers-details'>
      <summary className='summary-followers-title'>{fers.count} followers</summary>
      <table className="follow-table">
        <tbody>
          {fers.users.map((user) => {
            return <tr key={`follower${user.library_id}`}>
              <td>
                <Link to={`/dashboard/${user.library_id}`} className="follow-link">
                  {user.user_name.charAt(0).toUpperCase() + user.user_name.slice(1)}
                </Link>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </details>
  </div>
}