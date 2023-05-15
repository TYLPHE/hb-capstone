import { Link, useLoaderData } from "react-router-dom";

export default function Library() {
  const {
    library_name,
    library_games,
  } = useLoaderData();

  return (
    <div>
      <h1>{library_name}</h1>
      {library_games.map((game) => {
        return (
          <div key={ game.library_game_id }>
            <Link to={ `/review/${game.library_game_id}` }>
              My review of { game.game_name }
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