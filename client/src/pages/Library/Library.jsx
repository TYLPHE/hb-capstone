import './Library.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Library(params) {
  const { library_games, library_owner } = params;
  const [libGames, setLibGames] = useState(library_games)
  
  useEffect(() => {
    setLibGames(library_games)
  }, [library_games])

  useEffect(() => {
    return () => {
      setLibGames([])
    }
  }, [])
  
  // Link to the user's review page
  function Reviewed(params) {
    const { game } = params;
    const [publishTxt,setPublishTxt] = useState('Reviewed');
    const [notReviewTxt, setNotReviewTxt] = useState('Not reviewed')

    function DeleteButton(params) {
      const { id, state } = params

      return <>
        <Link 
          to={`/review/delete/${id}`} 
          state={state}
          className="reviewed delete-lib-btn"
        >
          Remove
        </Link>
      </>
    }
    
    if (game.reviewed) {
      return <div className="reviewed-container">
        <Link 
          to={`/review/${game.library_game_id}`} 
          className="reviewed reviewed-btn"
          onMouseOver={() => setPublishTxt('See Review')}
          onMouseOut={() => setPublishTxt('Reviewed')}
        >
          {publishTxt}
        </Link>
        {
          library_owner && 
          <DeleteButton 
            id={game.library_game_id} 
            state={{
              game: game.game_name, 
              game_id: game.game_id, 
              header_image: game.game_header_image, 
              review_id: game.library_game_id
            }} 
          />
        }
      </div>
    } else if (library_owner) {
      return <div className="reviewed-container">
        <Link 
          to={`/review/${game.library_game_id}`} 
          className="reviewed not-reviewed"
          onMouseOver={() => setNotReviewTxt('Add review')}
          onMouseOut={() => setNotReviewTxt('Not Reviewed')}
        >
          {notReviewTxt}
        </Link>
        {
          library_owner && 
          <DeleteButton 
            id={game.library_game_id} 
            state={{
              game: game.game_name, 
              game_id: game.game_id, 
              header_image: game.game_header_image, 
              review_id: game.library_game_id
            }} 
          />
        }
      </div>
    } else {
      return <div className="reviewed-container">
        <div className="reviewed not-reviewed">Not reviewed</div>
      </div>
    }
  }
  
  return <>
    <div>
      <table className="library-container">
        <tbody>
          {libGames.map((game) => {
            return (
              <tr 
                key={`$game${game.library_game_id}`} 
                className={library_owner ? `library-tr` : 'library-tr-visitor'} 
              >
                <td
                  className="library-td" 
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%), 
                      url(${game.game_background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <Link 
                    to={`/games/${game.game_id}/${game.game_name}`} 
                    className='library-link'
                  >
                    <img 
                      src={ game.game_header_image } 
                      alt='Game thumbnail' 
                      className="library-thumbnail"
                    />

                    <div className="review-title">{ game.game_name }</div>
                  </Link>

                  <Reviewed game={game}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </>
}