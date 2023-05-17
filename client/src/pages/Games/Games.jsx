import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom"
import Flash from "../../common/Flash/Flash";

export default function Games() {
  const navigate = useNavigate();
  const random_games = useLoaderData();
  const [search, setSearch] = useState(null);
  const [msg, setMsg] = useState(null);
    
  function handleSearch(value) {
    if (msg) {
      setMsg(null)
    }
    setSearch(value)
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (search === null || search.length < 2 ) {
      return setMsg('Search needs to be at least 2 characters.')
    } else {
      const request = await fetch(`/game-search?search=${search}`);
      const response = await request.json();
  
      if (Array.isArray(response)) {
        return navigate('/games/search-results', { state: response });
      }
      else if (response.status === 'Success') {
        return navigate(response.url);
      }
      else if (response.status === 'Error') {
        return setMsg(response.msg)
      }
    }
  }

  return (
    <div>
      { msg && <Flash msg={msg}/> }

      <h1>Browse Games</h1>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input 
            type='text' 
            id='search' 
            name='search'
            placeholder='Search for a game' 
            onChange={(e) => handleSearch(e.target.value)}
          />
          <input type='submit' value='Search' />
        </form>

        <h2>Random Games</h2>
        <div>
          {random_games.map((game) => {
            return (
              <div key={game.id}>
                <Link to={`/games/${game.id}/${game.name}`}>
                  <img src={game.header_image} alt='Header of game' />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}