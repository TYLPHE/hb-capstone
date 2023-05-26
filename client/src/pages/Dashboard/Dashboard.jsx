import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import './Dashboard.css';
import Library from '../Library/Library'
import Follow from '../../common/Follow/Follow'

export default function Dashboard() {
  const {
    following, 
    followers, 
    random_review,
    library_name,
    library_owner,
    followed,
    library_id,
    library_games,
  } = useLoaderData();
  const [name, setName] = useState(library_name)
  const [fing, setFing] = useState(following)
  const [fers, setFers] = useState(followers)
  const [owner, setOwner] = useState(library_owner)
  const [randomReview, setRandomReview] = useState(random_review)
  const [followBool, setFollowBool] = useState(followed)
  const [disableBtn, setDisableBtn] = useState(false)
  useEffect(() => {
    setName(library_name);
    setFing(following);
    setFers(followers);
    setOwner(library_owner);
    setFollowBool(followed);
    setRandomReview(randomReview)
  }, [library_name, following, followers, randomReview, library_owner, followed])

  console.log('DSH', useLoaderData())
  
  useEffect(() => {
    return () => {
      setOwner(null)
    }
  }, [])
  
  async function handleFollow() {
    setDisableBtn(true)
    const request = await fetch('/api/follow/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'library_id': library_id })
    })
    if (request.ok) {
      setFollowBool(true)
    }
    setDisableBtn(false)
  }

  async function handleUnfollow() {
    setDisableBtn(true)
    const request = await fetch('/api/follow/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'library_id': library_id })
    })
    if (request.ok) {
      setFollowBool(false)
    }
    setDisableBtn(false)
  }
  
  function FollowBtn() {
    if (followBool) {
      return <button className="unfollowed" onClick={handleUnfollow} disabled={disableBtn}>
        {`Unfollow ${library_name}`}
      </button>
    } else {
      return <button onClick={handleFollow} disabled={disableBtn}>
        {`Follow ${library_name}`}
      </button>
    }
  }
    
  
  function Followers() {
    return <div>
      <details>
        <summary>{fing.count} following</summary>
        <table className="follow-table">
          <tbody>
            {fing.users.map((user) => {
              return <tr key={user.user_id}>
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
      <details>
        <summary>{fers.count} followers</summary>
        <table className="follow-table">
          <tbody>
            {fers.users.map((user) => {
              return <tr key={user.library_id}>
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
  
  function RandomReview() {
      if (randomReview) {
        return <div>
          <details open>
            <summary>See a review by someone you followed</summary>
            <div>
              <div>
                {`${randomReview.username.charAt(0).toUpperCase() + randomReview.username.slice(1)}'s review of ${randomReview.game_name}`}
              </div>
            </div>
            <table className="dashboard-table">
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
      } else {
        return <div>
          <details open>
            <summary>See a review by someone you followed</summary>
            <div>
              <div>
                You are not following a user with reviews.
              </div>
            </div>
          </details>
        </div>
      }
  }
  
  return <>
    <h1>{ name }'s Profile</h1>
    {/* {!owner && <FollowBtn />} */}
    {!owner && <Follow followed={followed} library_id={library_id} library_name={library_name}/> }

    <div className="dashboard-buttons">
      {owner && <RandomReview />}
      <Followers />
    </div>

    <Library 
      followed={followed}
      library_id={library_id}
      library_name={library_name}
      library_games={library_games}
      library_owner={library_owner}
    />
  </>
}
