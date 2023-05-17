import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReviewDelete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { game, game_id, header_image, review_id } = state;
  const [disableBtn, setDisableBtn] = useState(false);

  async function handleDelete() {
    setDisableBtn(true);
    await fetch('/delete-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'review_id': review_id 
      }),
    });
    return navigate('/library');
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
      <div>
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
    </div>
  );
}