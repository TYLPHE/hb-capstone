import { useState, useEffect } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import './GameDetails.css'

export default function GameDetails() {
  const { id } = useParams();
  const {
    background,
    header_image,
    in_library,
    name,
    release_date,
    short_description,
    screenshots,
    movies,
    developers,
    genres,
    reviews,
  } = useLoaderData();
  const navigate = useNavigate();
  const [inLibrary, setInLibrary] = useState(in_library);
  const [AddBtnTxt, setAddBtnTxt] = useState('Add to my library');
  
  useEffect(() => {
    setInLibrary(in_library)
  }, [in_library])

  useEffect(() => {
    const root = document.querySelector('#root');
    root.style.backgroundImage = `url(${background})`;
  }, [background]);
  
  useEffect(() => {
    return () => {
      const root = document.querySelector('#root');
      root.style.backgroundImage = null;
    }
  }, []);
  
  function handleReturn() {
    const root = document.querySelector('#root')
    root.style.backgroundImage = null;
    navigate(-1)
  }
  
  async function handleAdd() {
    setAddBtnTxt('Adding...');

    const request = await fetch('/api/library-game/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (request.ok) {
      const response = await request.text();
      setInLibrary(true);
      return setAddBtnTxt(response);
    } 
    else {
      const response = await request.text();
      setAddBtnTxt('Add to my library')
      return console.error(response)
    }
  }

  function AddBtn() {
    return <button className="game-details-btn" onClick={handleAdd}>{AddBtnTxt}</button>;
  }

  function AddBtnDisabled() {
    return <button className="game-details-btn" disabled>Added to my library</button>;
  }

  function ToLibrary() {
    return <Link to='/dashboard'>
      <button className="game-details-btn">Return to library</button>
    </Link>
  }

  function ToAddReview() {
    async function redirectToReview() {
      const request = await fetch(`/api/library-game/to-add-review?game_id=${id}`) ;
      if (request.ok) {
        const response = await request.text();
        return navigate(response)
      } else {
        return console.error('ToAddReview error')
      }
    }
    return <button className="game-details-btn" onClick={redirectToReview}>
      Add review
    </button>
  }
  
  function GameDetailsReviews(params) {
    const { reviews } = params;

    function UserLink(params) {
      const { reviews } = params;
      return reviews.map((r) => {
        if (r.votes_up) {
          return <Link key={r.review_id} className="user-link" to={`/review/${r.review_id}`}>
            <div className={`user-title`}>
              {r.user_name} 🡅
            </div>
          </Link> 
        } else if (r.votes_up === false) {
          return <Link key={r.review_id} className="user-link" to={`/review/${r.review_id}`}>
            <div className={`user-title`}>
              {r.user_name} 🡇
            </div>
          </Link> 
        } else {
          return <Link key={r.review_id} className="user-link" to={`/review/${r.review_id}`}>
            <div className={`user-title`}>
              {r.user_name}
            </div>
          </Link> 
        }
      });
    }
    
    if (params.length === 0) {
      return <div>No reviews for this game</div>
    }
    return <div className="GTR-container">
      <details open>
        <summary>User Reviews</summary>
        <UserLink reviews={reviews} />
      </details>


    </div>
  }

  return <>
    <h1>{ name }</h1>
    <div className="details-btn-container">
      <button 
        onClick={handleReturn} 
        className="game-details-btn"
      >
        Return
      </button>
      {inLibrary && <ToLibrary />}
      {inLibrary && <ToAddReview />}
      {inLibrary ? <AddBtnDisabled /> : <AddBtn />}
    </div>
    <div className="details-header-container">
      <img src={ header_image } alt="Game header"/>

      <div className="details-right-container">
        <div className="description">
          <p className="desc-paragraph" dangerouslySetInnerHTML={{__html: short_description}} />
        </div>
        <div>Genre: {genres[0]}</div>
        <div>Release Date: { release_date }</div>
        <div>Developer: {developers[0]}</div>
      </div>
    </div>
    <GameDetailsReviews reviews={reviews}/>

    <div>
    </div>
  </>
}