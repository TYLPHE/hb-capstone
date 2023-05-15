import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

export default function Review() {
  const {
    game,
    game_id,
    header_image,
    review,
    score,
  } = useLoaderData();
  const [myScore, setMyScore] = useState(score)

  function MyScore() {
    return <p>My Score: {score} / 5</p>
  }

  return (
    <div>
      <h1>{ game }</h1>
        <Link to={`/games/${ game_id }/${ game }`} >
          <img src={header_image} alt="header of game" />
        </Link>
      <h2>Review</h2>
      <p>{review}</p>
      { score && <MyScore /> }
    </div>
  );
}