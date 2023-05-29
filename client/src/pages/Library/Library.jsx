import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Library.css';

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

    if (game.reviewed) {
      return (
        <Link 
          to={`/review/${game.library_game_id}`} 
          className="reviewed"
          onMouseOver={() => setPublishTxt('See Review')}
          onMouseOut={() => setPublishTxt('Reviewed')}
        >
          {publishTxt}
        </Link>
      )
    } else if (library_owner) {
      return (
        <Link 
          to={`/review/${game.library_game_id}`} 
          className="reviewed not-reviewed"
          onMouseOver={() => setNotReviewTxt('Add review')}
          onMouseOut={() => setNotReviewTxt('Not Reviewed')}
        >
          {notReviewTxt}
        </Link>
      )
    } else {
      return <div className="reviewed not-reviewed">Not reviewed</div>
    }
  }
  
  return <>
    <h2>Library</h2>
    <div>
      <table className="library-container">
        <tbody>
          {libGames.map((game) => {
            return (
              <tr key={`$game${game.library_game_id}`} className="library-tr">
                <td
                  className="library-td" 
                  style={{
                    backgroundImage: `url(${game.game_background})`,
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