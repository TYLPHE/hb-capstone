import { Link, useLoaderData } from "react-router-dom";
import Header from '../../common/Header/Header'

export default function Library() {
  const {
    library_name,
    library_games,
  } = useLoaderData();

  return (
    <div>
      <Header />
      <h1>{library_name}</h1>
      {library_games.map((game) => {
        return (
          <div key={ game.library_game_id }>
            <Link to={ `/review/${game.library_game_id}` }>
              <h2>My review of { game.game_name }</h2>
            </Link>
            <div>
              <Link to={`/games/${ game.game_id }/${ game.game_name }`}>
                <img src={ game.game_header_image } alt='Game thumbnail'></img>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}