import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Search.css';

export default function Search({ msg, setMsg }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(null);

  function handleSearch(value) {
    if (msg) {
      setMsg(null);
    }
    setSearch(value)
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (search === null || search.length < 2 ) {
      return setMsg('Search needs to be at least 2 characters.')
    } else {
      const request = await fetch(`/api/games/search?search=${search}`);
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
    <form onSubmit={(e) => handleSubmit(e)} className="search-bar">
      <input 
        type='text' 
        id='search' 
        name='search'
        placeholder='Search for a game' 
        onChange={(e) => handleSearch(e.target.value)}
      />
      <input 
        type='submit' 
        value='Search' 
        className="search-button"
      />
    </form>
  );
}