import { Link, useLoaderData } from "react-router-dom"
import './Games.css';

export default function Games() {
  const random_games = useLoaderData();

  return <>
    <h1>Browse Games</h1>

    <div>Random Games</div>
    
    <div className="random-games-container">
      {random_games.map((game) => {
        return (
          <div key={game.id}>
            <Link to={`/games/${game.id}/${game.name.replace('/', '')}`}>
              <img 
                src={game.header_image} 
                alt='Header of game'
                className="game-img"
              />
            </Link>
          </div>
        );
      })}
    </div>
  </>
}