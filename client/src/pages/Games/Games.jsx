import { Link, useLoaderData } from "react-router-dom"
import './Games.css';

export default function Games() {
  const random_games = useLoaderData();

  return (
    <div>
      <div className="main-view">
        <h1>Browse Games</h1>
        <div className="main-view">
          <div>Random Games</div>
          <div className="random-games-container">
            {random_games.map((game) => {
              return (
                <div key={game.id}>
                  <Link to={`/games/${game.id}/${game.name}`}>
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

        </div>
      </div>
    </div>
  )
}