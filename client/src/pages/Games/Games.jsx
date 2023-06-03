import './Games.css';
import { Link, useLoaderData } from "react-router-dom"
import Filters from '../../common/Filters/Filters'
import { useEffect, useState, useRef } from 'react';

export default function Games() {
  const random_games = useLoaderData();
  const [games, setGames] = useState([]);
  const [randGames, setRandGames] = useState(random_games)
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState(null);
  const inputElement = useRef(null);

  // Autofocus search bar after loading components
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, [])
  
  useEffect(() => {
    setRandGames(random_games);
  }, [random_games]);
  
  useEffect(() => {
    async function reqFilter() {
      const request = await fetch('/api/games/filter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ filters }),
      });
       if (request.ok) {
        const response = await request.json();
        if (response.games.length === 0) {
          return setGames([]);
        } else {
          return setGames(response.games);
        }
       }
    }
    reqFilter();
  }, [filters])

  function handleAddFilters(letter) {
    setFilters([...filters, letter])
  }
  function handleRmFilters(letter) {
    setFilters(filters.filter((item) => item !== letter))
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!filters.includes(search)) {
      setFilters([...filters, search]);
    }
    e.target.firstChild.value = '';
  }
  
  function FilterList() {
    return <>
      {filters.map((filter) => {
        return <div key={filter} className="filter-div">
          {`"${filter}"`}
          <button onClick={() => handleRmFilters(filter)}>x</button>
        </div>
      })}
    </>
  }
  
  function RandomGames() {
    return <div className='random-games-container'>
      {randGames.map((game) => {
        return <div key={game.id} className='games-tr'>
          <div className="games-td" >
            <Link 
              to={`/games/${game.id}/${game.name}`} 
              className='games-link'
            >
              <img 
                src={ game.header_image } 
                alt='Game thumbnail' 
                className="rand-games-thumbnail"
              />
            </Link>
          </div>
        </div>
      })}
    </div>
  }

  return <>
    <h1>Browse Games</h1>
    <div>Random Games</div>
    <RandomGames />
    <div className="browse-container">
      <div className='filter-list-container'>
        <FilterList />
      </div>
      <div className="filter-search-container">
        <form onSubmit={(e) => handleSubmit(e)} className="games-search-bar">
          <input 
            type='text' 
            id='game-search' 
            name='search'
            placeholder='Search for a game' 
            onChange={(e) => setSearch(e.target.value)}
            ref={inputElement}
          />
          <input 
            type='submit' 
            value='Search' 
            className="search-button"
          />
        </form>
      </div>
      <div className="list-filter-container">
        <div className="list-container">
          <table className='games-table'>
            <tbody>
              {games.map((game) => {
                return <tr key={game.id} className='games-tr'>
                  <td className="games-td" >
                    <Link 
                      to={`/games/${game.id}/${game.name}`} 
                      className='games-link'
                    >
                      <img 
                        src={ game.header_image } 
                        alt='Game thumbnail' 
                        className="games-thumbnail"
                      />

                      <div className="game-title">{ game.name }</div>
                    </Link>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <div className="filter-container">
          <Filters 
            filters={filters}
            setFilters={setFilters}
            handleAddFilters={handleAddFilters}
            handleRmFilters={handleRmFilters}
          />
        </div>
      </div>
    </div>
  </>
}