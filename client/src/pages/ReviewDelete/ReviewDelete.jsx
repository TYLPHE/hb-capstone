import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import './ReviewDelete.css'

export default function ReviewDelete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { game, header_image, review_id } = state;
  const [disableBtn, setDisableBtn] = useState(false);

  
  function DeleteBtn() {
    async function handleDelete() {
      setDisableBtn(true);
      
      const request = await fetch('/api/review/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id }),
      });
  
      if (request.ok) {
        return navigate('/dashboard');
      } else {
        setDisableBtn(false);
        return console.error('Error: /app/review/delete. Did not delete.');
      }
    }

    if (disableBtn) {
      return <button className="delete-btn" disabled>
          Deleting...
        </button>
    } else {
      return <button className="delete-btn" onClick={handleDelete}>
          Yes, remove from library and delete review
        </button>
    }
  }
  
  return <>
    <h1>Delete Confirmation</h1>
    
    <div className="delete-container">
      <div>{game}</div>
      
      <div>
        <img src={header_image} alt="" />
      </div>
      
      <p>
        Are you sure you want to remove the game and, if reviewed, delete review from the library?
      </p>
      <div className="delete-container">
        <DeleteBtn />
        <Link to={`/review/${review_id}`}>
          <button className="delete-btn">No, do not delete and return</button>
        </Link>
      </div>
    </div>
  </>
}