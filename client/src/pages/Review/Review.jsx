import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import './Review.css';

export default function Review() {
  const {
    game,
    game_id,
    header_image,
    review,
    review_id,
    score,
  } = useLoaderData();
  const [myScore, setMyScore] = useState(score)

  useEffect(() => {
    setMyScore(5)
  }, [])

  function MyScore() {
    return <p>My Score: {myScore} / 5</p>
  }
  
  return (
    <div>
      <div className="main-view">
        <div className="review-header">
          <Link 
            to={`/games/${ game_id }/${ game }`}
            className="review-image-link"
          >
            <img 
              src={header_image} 
              alt="header of game"
            />
          </Link>
          <div className="review-data">
            { score && <MyScore /> }
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
                <button className="review-button
                ">Delete review and remove from library</button>
              </Link>
            </div>
          </div>
        </div>
          <MDEditor.Markdown 
            source={review}
            style={{ 
              padding: '2rem',
              borderRadius: '4px'
            }} 
          />
      </div>
    </div>
  );
}