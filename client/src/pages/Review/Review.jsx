import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

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
      <h1>{ game }</h1>
        <Link to={`/games/${ game_id }/${ game }`} >
          <img src={header_image} alt="header of game" />
        </Link>
      { score && <MyScore /> }
      <div>
        <Link to={`/review/edit/${review_id}`}>
          <button>Edit Review</button>
        </Link>
      </div>
        <MDEditor.Markdown source={review} />

      <div>
        <Link to={`/review/delete/${review_id}`}>
          <button>Delete review and remove from library</button>
        </Link>
      </div>
    </div>
  );
}