import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from '../../common/Header/Header'

export default function ReviewDelete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { game, game_id, header_image, review_id } = state;
  const [disableBtn, setDisableBtn] = useState(false);

  async function handleDelete() {
    setDisableBtn(true);
    
    const request = await fetch('/api/review/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id }),
    });

    if (request.ok) {
      return navigate('/library');
    } else {
      setDisableBtn(false);
      return console.error('Error: /app/review/delete. Did not delete.');
    }
  }

  function DeleteBtn() {
    if (disableBtn) {
      return (
        <button disabled>
          Yes, Delete review and remove from library
        </button>
      );
    } else {
      return (
        <button onClick={handleDelete}>
          Yes, Delete review and remove from library
        </button>
      );

    }
  }
  
  return (
    <div>
      <Header />
      <h1>Delete Confirmation</h1>
      <div>{game}</div>
      <div>
        <img src={header_image} alt="" />
      </div>
      <p>
        Are you sure you want to delete the review and remove the game from the library?
      </p>
      <div>
        <DeleteBtn />
      </div>
    </div>
  );
}