import './Dashboard.css';
import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import Library from '../Library/Library'
import Follow from '../../common/Follow/Follow'
import Followers from "../../common/Followers/Followers";

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

  console.log(useLoaderData())
  
  const [name, setName] = useState(library_name)
  const [fing, setFing] = useState(following)
  const [fers, setFers] = useState(followers)
  const [owner, setOwner] = useState(library_owner)
  const [randomReview, setRandomReview] = useState(random_review)
  const [libGames, setLibGames] = useState(library_games)
  
  useEffect(() => {
    setName(library_name);
    setFing(following);
    setFers(followers);
    setOwner(library_owner);
    setRandomReview(randomReview)
    setLibGames(library_games)
  }, [library_name, following, followers, randomReview, library_owner, library_games])

  useEffect(() => {
    return () => {
      setOwner(null)
    }
  }, [])
  
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
    {!owner && <Follow followed={followed} library_id={library_id} library_name={library_name}/> }

    <div className="dashboard-buttons">
      {owner && <RandomReview />}
      <Followers fing={fing} fers={fers}/>
    </div>

    <Library 
      followed={followed}
      library_id={library_id}
      library_name={library_name}
      library_games={libGames}
      library_owner={library_owner}
    />
  </>
}
