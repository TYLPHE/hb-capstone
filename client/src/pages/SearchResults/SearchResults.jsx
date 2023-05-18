import { Link, useLocation } from "react-router-dom";
import Header from '../../common/Header/Header'
import './SearchResults.css';

export default function SearchResults() {
  const { state } = useLocation();

  return (
    <div>
      <Header />
      <div className="main-view">
        <h1>Search Results</h1>
        <table className="search-results-table">
          {state.map((game) => {
            return (
              <tr className="search-results-tr">
                <Link 
                  to={`/games/${game.id}/${game.name}`}
                  className="search-results-link"
                >{game.name}</Link>
              </tr>
            )
          })}

        </table>
      </div>
    </div>
  );
}