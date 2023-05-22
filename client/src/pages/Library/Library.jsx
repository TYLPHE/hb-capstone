import { Link, useLoaderData } from "react-router-dom";
import './Library.css';

export default function Library() {
  const {
    library_name,
    library_games,
  } = useLoaderData();
  console.log(library_games)
  return <>
    <h1>{library_name.charAt(0).toUpperCase() + library_name.slice(1)}'s Library</h1>
    <div>Reviews</div>
    <table>
      <tbody>
        {library_games.map((game) => {
          return (
            <tr key={ game.library_game_id } className="library-tr">
              <td 
                className="library-td" 
                style={{
                  backgroundImage: `url(${game.game_background})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Link to={ `/review/${game.library_game_id}`}  className='library-link'>
                    <img src={ game.game_header_image } alt='Game thumbnail' className="library-thumbnail"></img>
                    <span className="review-title">{ game.game_name }</span>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </>
}