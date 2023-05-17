import { Link, useLoaderData } from "react-router-dom"
import Header from '../../common/Header/Header';

export default function Games() {
  const random_games = useLoaderData();

  return (
    <div>
      <Header />
      <div className="main-view">
        <h1>Browse Games</h1>
        <h2>Random Games</h2>
        <div>
          {random_games.map((game) => {
            return (
              <div key={game.id}>
                <Link to={`/games/${game.id}/${game.name}`}>
                  <img src={game.header_image} alt='Header of game' />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}