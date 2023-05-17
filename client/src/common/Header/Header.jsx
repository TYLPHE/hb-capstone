import { useNavigate } from 'react-router-dom';
import './Header.css';


export default function Header() {
  const navigate = useNavigate();
  
  async function handleLogOut() {
    await fetch('/log-out')
    return navigate('/');
  }

  function LogOut() {
    return (
      <button 
        className="log-out-button"
        onClick={handleLogOut}
      >
        Log Out
      </button>
    );
  }

  return (
    <div className='header-container'>
      <header className='main-header'>
        <div className='logo'>Logo Image</div>
        <nav className='header-nav'>Navigation</nav>
        <div className="search">Search</div>
        <div className='log-out'>
          <LogOut />
        </div>
      </header>
    </div>
  );
}