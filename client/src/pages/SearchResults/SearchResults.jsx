import { Link, useLocation } from "react-router-dom";
import Header from '../../common/Header/Header'


export default function SearchResults() {
  const { state } = useLocation();
  console.table(state)
  return (
    <div>
      <Header />
      <h1>Search Results</h1>
      {state.map((game) => {
        return (
          <div>
            <Link to={`/games/${game.id}/${game.name}`}>{game.name}</Link>
          </div>
        )
      })}
    </div>
  );
}