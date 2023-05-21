import { Link, useLoaderData } from "react-router-dom";
import Header from '../../common/Header/Header'
import './Library.css';

export default function Library() {
  const {
    library_name,
    library_games,
  } = useLoaderData();

  return (
    <div className='viewport'>
      <Header />
      <div className="main-view">
        <h1>{library_name}</h1>
        <div>Reviews</div>
        <table>
          <tbody>
            {library_games.map((game) => {
              return (
                <tr key={ game.library_game_id } className="library-tr">
                  <td className="library-td">
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
      </div>
    </div>
  );
}