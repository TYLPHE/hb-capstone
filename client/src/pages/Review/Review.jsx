import { useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import './Review.css';

export default function Review() {
  const {
    background,
    game,
    game_id,
    header_image,
    owner,
    owner_username,
    review,
    review_id,
    reviewed,
    user_id,
    votes_up,
  } = useLoaderData();

  console.log(useLoaderData())
  
  useEffect(() => {
    const root = document.querySelector('#root');
    root.style.backgroundImage = `url(${background})`;
    window.scrollTo(0,0)
  }, [background]);

  useEffect(() => {
    return () => {
      const root = document.querySelector('#root');
      root.style.backgroundImage = null;
    }
  }, []);

  function EditButtons(params) {
    const { owner, game, game_id, header_image, review_id } = params

    if (owner) {
      return <>
        <div className="review-data">
          <div>
            <Link to={`/dashboard/${user_id}`}>
              <button className="review-button">My Profile</button>
            </Link>
          </div>

          <div>
            <Link 
              to={`/review/edit/${review_id}`}
              state={{ game, game_id, header_image, review_id }}
            >
              <button 
                className="review-button"
              >
                Edit Review
              </button>
            </Link>
          </div>
        </div>
      </>
    } else {
      return <>
        <div className="review-data-unowned">
          <div>
            <Link to={`/dashboard/${user_id}`}>
              <button className="review-button-unowned">To {owner_username.charAt(0).toUpperCase() + owner_username.slice(1)}'s Profile</button>
            </Link>
          </div>
        </div>
      </>
    }
  }

  function RecommendedStatus() {
    if (votes_up) {
      return <div className="recommendation-container positive-rec">
        <div className="rec-arrow">🡅</div>
        <div className="recommendation">Recommended by {owner_username.charAt(0).toUpperCase() + owner_username.slice(1)}</div>
      </div>
    } 
    else if (votes_up === false) {
      return <div className="recommendation-container negative-rec">
        <div className="rec-arrow">🡇</div>
        <div className="recommendation">Not recommended by {owner_username.charAt(0).toUpperCase() + owner_username.slice(1)}</div>
      </div>
    } else {
      return
    }
  }
  
  return <>
    <h1>{owner_username.charAt(0).toUpperCase() + owner_username.slice(1)}'s review of {game}</h1>
    <div className="review-header">
      <EditButtons 
        owner={owner}
        game={game}
        game_id={game_id}
        header_image={header_image}
        review_id={review_id}
      />

      <Link to={`/games/${ game_id }/${ game.replace('/', '') }`} className="review-image-link">
        <img src={header_image} alt="header of game" />
      </Link>
    </div>
    {reviewed && <RecommendedStatus />}
    {reviewed ? <MDEditor.Markdown 
      source={review}
      style={{ 
        padding: '2rem',
        borderRadius: '4px'
      }} 
    /> : <div className="not-published">This review is not published.</div>}

  </>
}