import './Users.css';
import { useState, useEffect } from 'react';
import { useLoaderData, Link } from "react-router-dom"
import Filters from '../../common/Filters/Filters'

export default function Users() {
  const { users } = useLoaderData();
  const [usersArr, setUsers] = useState(users);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    if (!filters.length) {
      return setUsers(users);
    } else {
      filters.forEach((filter) => {
        if (filter.length === 1) {
          setUsers(users.filter((user) => filter.toLowerCase() === user.username[0]));
        } else {
          setUsers(users.filter((user) => user.username.includes(filter)))
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  
  return <>
    <h1>All Users</h1>
    <div className="browse-container">
      <div className='filter-list-container'>
        <FilterList />
      </div>
      <div className="filter-search-container">
        <form onSubmit={(e) => handleSubmit(e)} className="users-search-bar">
          <input 
            type='text' 
            id='user-search' 
            name='search'
            placeholder='Search for a user' 
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
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
          <table className='users-table'>
            <tbody>
              {usersArr.map((user) => {
                return <tr key={user.id} className='users-tr'>
                  <td className="users-td" >
                    <Link 
                      to={`/dashboard/${user.id}`} 
                      className='users-link'
                    >

                      <div className="user-title">{ user.username }</div>
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
    {/* <table>
      <tbody>
        {users.map((user) => {
          return <tr key={user.id}>
            <td id={user.id}>
              <Link to={`/dashboard/${user.id}`} className="user-link">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </Link>
            </td>
          </tr>
        })}
      </tbody>
    </table> */}
  </>
}