import { Link } from "react-router-dom"
import './NavButtons.css'

export default function NavButtons() {
  return <div className='nav-buttons'>
    <Link to='/library'><button>See My Reviews</button></Link>
    <Link to='/users'><button>See reviews of others</button></Link>
    <Link to='/games'><button>Browse all games</button></Link>
  </div>
}