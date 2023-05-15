import { Link } from 'react-router-dom';
import './Welcome.css'

export default function Welcome() {
  return (
    <div className='welcome'>
      <h1 className='welcome-header'>Welcome to Game Reviewer</h1>
      <div>
        <Link to='login'>
          <button className='sign-register'>Sign In</button>
        </Link>
        <Link to='register'>
          <button className='sign-register'>Register</button>
        </Link>
      </div>
    </div>
  );
}
