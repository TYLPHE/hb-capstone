import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Library.css';

export default function Library(params) {
  const {
    followed,
    library_id,
    library_name,
    library_games,
    library_owner,
  } = params;
  const [followBool, setFollowBool] = useState(followed)
  const [disableBtn, setDisableBtn] = useState(false)
  const [owner, setOwner] = useState(library_owner)
  const [libGames, setLibGames] = useState(library_games)

  useEffect(() => {
    setOwner(library_owner)
    setFollowBool(followed)
    setLibGames(library_games)
  }, [library_owner, followed, library_games])

  useEffect(() => {
    return () => {
      setLibGames([])
    }
  }, [])

  // async function handleFollow() {
  //   setDisableBtn(true)
  //   const request = await fetch('/api/follow/add', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ 'library_id': library_id })
  //   })
  //   if (request.ok) {
  //     setFollowBool(true)
  //   }
  //   setDisableBtn(false)
  // }

  // async function handleUnfollow() {
  //   setDisableBtn(true)
  //   const request = await fetch('/api/follow/delete', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ 'library_id': library_id })
  //   })
  //   if (request.ok) {
  //     setFollowBool(false)
  //   }
  //   setDisableBtn(false)
  // }
  
  // function FollowBtn() {
  //   if (followBool) {
  //     return <button className="unfollowed" onClick={handleUnfollow} disabled={disableBtn}>
  //       {`Unfollow ${library_name}`}
  //     </button>
  //   } else {
  //     return <button onClick={handleFollow} disabled={disableBtn}>
  //       {`Follow ${library_name}`}
  //     </button>
  //   }
  // }
    
  // function LibraryTitle() {
  //   if (owner) {
  //     return <h2>My Library</h2>
  //   } else {
  //     return <h2>{library_name.charAt(0).toUpperCase() + library_name.slice(1)}'s Library</h2>
  //   }
  // }
  
  return <>
    {/* <LibraryTitle /> */}
    <h2>Library</h2>
    <div className="reviews-container">
      {/* <div className="reviews-top-bar">
        // <div>
          {!owner && <FollowBtn />}
        </div>
      </div> */}

      <table className="library-container">
        <tbody>
          {libGames.map((game) => {
            return (
              <tr key={ game.game_name } className="library-tr">
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
    </div>
  </>
}