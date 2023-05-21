import { Link } from 'react-router-dom';
import './Welcome.css'

export default function Welcome() {
  return <div className='welcome'>
    {/* Logo is a unicode icon called Circled Cross Formee. 
        I hope its not racist or something */}
    <div className='welcome-logo'>🤂</div>
    
    <div className='welcome-message'>Welcome to Game Reviewer</div>
    
    <div>
      <Link to='signin'>
        <button className='sign-register'>Sign In</button>
      </Link>
      
      <Link to='register'>
        <button className='sign-register'>Register</button>
      </Link>
    </div>
  </div>
}
