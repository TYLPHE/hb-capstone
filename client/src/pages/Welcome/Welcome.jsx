import './Welcome.css'

export default function Welcome() {
  return (
    <div className='welcome'>
      <h1>Welcome to Game Reviewer</h1>
      <div>
        <a href="/login">
          <button className='sign-register'>Sign In</button>
        </a>
        <a href="/register">
          <button className='sign-register'>Register</button>
        </a>
      </div>
    </div>
  );
}
