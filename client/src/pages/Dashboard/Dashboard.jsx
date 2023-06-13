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
          <div className='dashboard-title'>Random review by someone you followed</div>
          <div
            className="random-library-thumbnail" 
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 100%), url(${randomReview.game_background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <Link to={ `/review/${randomReview.library_game_id}`}  className='random-library-link'>
              <div className='random-review-title'>
                {`${randomReview.username.charAt(0).toUpperCase() + randomReview.username.slice(1)}'s review of ${randomReview.game_name}`}
              </div>
              <img src={ randomReview.game_header_image } alt='Game thumbnail' className="random-library-thumbnail"></img>
            </Link>
          </div>
        </div>
      } else {
        return <div>
          <details>
            <summary>Random review by someone you followed</summary>
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
    {library_owner ? <h1>My Library</h1> : <h1>{ name }'s Profile</h1>}
    
    {!owner && <Follow followed={followed} library_id={library_id} library_name={library_name}/> }
    <div className='dashboard-title'>Followers</div>

    <div className="dashboard-buttons">
      <Followers fing={fing} fers={fers}/>
      {owner && <RandomReview />}
    </div>
    <div className='dashboard-title'>Library</div>
    <Library 
      followed={followed}
      library_id={library_id}
      library_name={library_name}
      library_games={libGames}
      library_owner={library_owner}
    />
  </>
}
