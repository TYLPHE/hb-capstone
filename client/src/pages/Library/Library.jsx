import { Link, useLoaderData } from "react-router-dom";
import './Library.css';
import { useEffect, useState } from "react";

export default function Library() {
  const {
    followed,
    library_id,
    library_name,
    library_games,
    library_owner,
  } = useLoaderData();
  const [followBool, setFollowBool] = useState(followed)
  const [disableBtn, setDisableBtn] = useState(false)
  const [owner, setOwner] = useState(null)

  useEffect(() => {
    setOwner(library_owner)
    setFollowBool(followed)
  }, [library_owner, followed])

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
      return <button onClick={handleUnfollow} disabled={disableBtn}>
        {`Unfollow ${library_name}`}
      </button>
    } else {
      return <button onClick={handleFollow} disabled={disableBtn}>
        {`Follow ${library_name}`}
      </button>
    }
  }
  
  function FollowingUser() {
    return <div>{`You are following ${library_name}.`}</div>
  }
  
  return <>
    <h1>{library_name.charAt(0).toUpperCase() + library_name.slice(1)}'s Library</h1>

    <div>
      {followBool && <FollowingUser />}
      {!owner && <FollowBtn />}
    </div>

    <div>Reviews</div>
    <table>
      <tbody>
        {library_games.map((game) => {
          return (
            <tr key={ game.library_game_id } className="library-tr">
              <td
                className="library-td" 
                style={{
                  backgroundImage: `url(${game.game_background})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Link to={ `/review/${game.library_game_id}`}  className='library-link'>
                    <img src={ game.game_header_image } alt='Game thumbnail' className="library-thumbnail"></img>
                    <span className="review-title">{ game.game_name }</span>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </>
}