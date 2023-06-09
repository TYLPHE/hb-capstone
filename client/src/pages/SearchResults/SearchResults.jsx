import { Link, useLocation } from "react-router-dom";
import './SearchResults.css';

export default function SearchResults() {
  const { state } = useLocation();

  return <>
    <h1>Search Results</h1>
    
    <table className="search-results-table">
      <tbody>
        {state.map((game) => {
          return (
            <tr key={game.id} className="search-results-tr">
              <td className="search-results-td">
                <Link 
                  to={`/games/${game.id}/${game.name.replace('/', '')}`}
                  className="search-results-link"
                >{game.name}</Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </>
}