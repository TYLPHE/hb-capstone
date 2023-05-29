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
    user_id,
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
    const { owner } = params
    if (owner) {
      return <>
        <div className="review-data">
          <div>
            <Link to={`/dashboard/${user_id}`}>
              <button className="review-button">Return</button>
            </Link>
          </div>
          <div>
            <Link to={`/review/edit/${review_id}`}>
              <button className="review-button">Edit Review</button>
            </Link>
          </div>
          
          <div>
            <Link 
              to={`/review/delete/${review_id}`} 
              state={{ game, game_id, header_image, review_id }}
            >
              <button className="review-button">
                Delete
              </button>
            </Link>
          </div>
        </div>
      </>
    }
  }

  return <>
    <h1>{owner_username.charAt(0).toUpperCase() + owner_username.slice(1)}'s review of {game}</h1>
    <div className="review-header">
      <EditButtons owner={owner}/>

      <Link to={`/games/${ game_id }/${ game.replace('/', '') }`} className="review-image-link">
        <img src={header_image} alt="header of game" />
      </Link>

    </div>


    <MDEditor.Markdown 
      source={review}
      style={{ 
        padding: '2rem',
        borderRadius: '4px'
      }} 
    />
  </>
}