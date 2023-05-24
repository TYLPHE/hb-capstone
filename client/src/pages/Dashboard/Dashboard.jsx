import { Link, useLoaderData } from "react-router-dom";
import './Dashboard.css';
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { username, following, followers, random_review } = useLoaderData();
  const [name, setName] = useState(username)
  const [fing, setFing] = useState(following)
  const [fers, setFers] = useState(followers)
  const [randomReview, setRandomReview] = useState(random_review)

  // useEffect(() => {
  //   setName(username);
  // }, [username])
  
  // useEffect(() => {
  //   setFing(following);
  // }, [following])

  // useEffect(() => {
  //   setFers(followers);
  // }, [followers])

  // useEffect(() => {
  //   setRandomReview(randomReview)
  // }, [randomReview])

  useEffect(() => {
    setName(username);
    setFing(following);
    setFers(followers);
    setRandomReview(randomReview)
  }, [username, following, followers, randomReview])


  function Followers() {
    return <div>
      <details open>
        <summary>{fing.count} following</summary>
        <table className="follow-table">
          <tbody>
            {fing.users.map((user) => {
              return <tr key={user.library_id}>
                <td>
                  <Link to={`/library/${user.library_id}`} className="follow-link">
                    {user.user_name.charAt(0).toUpperCase() + user.user_name.slice(1)}
                  </Link>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </details>
      <details open>
        <summary>{fers.count} followers</summary>
        <table className="follow-table">
          <tbody>
            {fers.users.map((user) => {
              return <tr key={user.library_id}>
                <td>
                  <Link to={`/library/${user.library_id}`} className="follow-link">
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
  
  console.table(randomReview)
  
  function RandomReview() {
      return <div>
        <details open>
          <summary>See a review by someone you followed</summary>
          <div>
            <div>
              {`${randomReview.username.charAt(0).toUpperCase() + randomReview.username.slice(1)}'s review of ${randomReview.game_name}`}
            </div>
          </div>
          <table>
            <thead>
              <tr className="library-tr">
                <td
                  className="library-td" 
                  style={{
                    backgroundImage: `url(${randomReview.game_background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <Link to={ `/review/${randomReview.library_game_id}`}  className='library-link'>
                      <img src={ randomReview.game_header_image } alt='Game thumbnail' className="library-thumbnail"></img>
                      <span className="review-title">{ randomReview.game_name }</span>
                  </Link>
                </td>
              </tr>    
            </thead>
          </table>
        </details>

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
      <RandomReview />
    </div>
  </>
}
