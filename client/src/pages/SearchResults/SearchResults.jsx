import { Link, useLocation } from "react-router-dom";

export default function SearchResults() {
  const { state } = useLocation();
  console.table(state)
  return (
    <div>
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