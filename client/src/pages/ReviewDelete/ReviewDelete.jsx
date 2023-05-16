export default function ReviewDelete() {
  function handleDelete() {
    // TODO: going swimming
    console.log('delete');
  }
  
  return (
    <div>
      <h1>Delete Confirmation</h1>
      <p>
        Are you sure you want to delete the review and remove the game from the library?
      </p>
      <div>
        <button onClick={handleDelete}>Delete review and remove from library</button>
      </div>
    </div>
  )
}