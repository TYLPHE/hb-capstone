import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';
import Search from '../Search/Search';
import Flash from '../Flash/Flash'

export default function Header() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const [userInitials, setUserInitials] = useState('GR')

  useEffect(() => {
    (async () => {
      const request = await fetch('/api/user/initials');
      if (request.ok) {
        const response = await request.text();
        setUserInitials(response)
      }
    })();
  }, [])
  
  async function handleLogOut() {
    await fetch('/api/user/logout')
    return navigate('/');
  }

  function LogOut() {
    return (
      <button 
        className="logout-button"
        onClick={handleLogOut}
      >
        Log Out
      </button>
    );
  }

  return (
    <div className='header-container'>
      {msg && <Flash msg={msg}/>}
      <header className='main-header'>
        <Link to='/' className='logo'>🤂</Link>

        <nav className='header-nav'>
          <NavLink to='/dashboard' className='nav-button'>Dashboard</NavLink>
          <NavLink to='/library' className='nav-button'>Library</NavLink>
          <NavLink to='/Games' className='nav-button'>Browse Games</NavLink>
          <NavLink to='/Users' className='nav-button'>All Users</NavLink>
        </nav>

        <div className="header-search">
          <Search msg={msg} setMsg={setMsg} />
        </div>

        <div className='profile'>
          <div className='initials'>{userInitials}</div>
          <LogOut />
        </div>
      </header>
    </div>
  );
}