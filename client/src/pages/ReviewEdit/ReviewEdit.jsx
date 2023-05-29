import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useState } from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import Flash from '../../common/Flash/Flash';
import './ReviewEdit.css';

export default function ReviewEdit() {
  const { id, review, owner, reviewed } = useLoaderData();
  const { state } = useLocation();
  const [value, setValue] = useState(review);
  const [msg, setMsg] = useState(null);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);

  console.log(state)

  async function handleUpdate() {
    setDisableUpdateBtn(true);

    const request = await fetch('/api/review/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, 'review': value }),
    });
    if (request.ok) {
      const response = await request.text();
      return setMsg(response);
    } else {
      const response = await request.text();
      console.error('ReviewEdit.jsx handleUpdate error.')
      return setMsg(response)
    }
  }
  
  function handleValue(e) {
    if (msg) {
      setMsg(null);
    }
    if (disableUpdateBtn) setDisableUpdateBtn(false);
    setValue(e)
  }
  
  function UpdateButton() {
    if (disableUpdateBtn) {
      return <button className='save-button' disabled>Save</button>
    } else {
      return <button className='save-button' onClick={handleUpdate}>Save</button>
    }
  }
  
  function Publish(params) {
    const { reviewed } = params;
    const [active, setActive] = useState(false);
    const [isReviewed, setReviewed] = useState(reviewed)
    

    
    async function handlePublish() {
      const request = await fetch('/api/review/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: id })
      })
      if (request.ok) {
        const response = await request.json();
        setReviewed(response['reviewed']);
      } else {
        console.error('ReviewEdit error. Publish error.')
      }
    }
    
    function popupMessage() {
      if (isReviewed) {
        return 'Click to hide your review from other users.'
      } else {
        return 'Publishing will allow other users to see your review.'
      }
    }
    
    return <div className='publish-container'>
      <button 
        onMouseOver={() => setActive(true)}
        onMouseOut={() => setActive(false)}
        onClick={handlePublish}
        className={`save-button ${isReviewed ? 'is-reviewed' : ''}`} 
      >
        {isReviewed ? 'Published' : 'Publish'}
      </button>
      <div 
        className={`publish-popup ${active ? "popup" : ""}`}
        onMouseOver={() => setActive(true)}
        onMouseOut={() => setActive(false)}        
      >
        {popupMessage()}
      </div>
    </div>
    
  }

  return <>
    {msg && <Flash msg={ msg } />}
    
    <h1>Edit Review</h1>

    <div className='edit-button-container'>
      <Link to={`/review/${id}`}>
        <button className='save-button'>Return</button>
      </Link>
      
      <div>
        <Link 
          to={`/review/delete/${id}`} 
          state={state}
        >
          <button className="review-button">
            Delete
          </button>
        </Link>
      </div>

      <UpdateButton />
      
      <Publish reviewed={reviewed}/>
    </div>

    {owner ? <MDEditor 
      value={value} 
      onChange={ (e) => handleValue(e) } 
      previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
      height={800}
      className='editor'
    /> : 'You cannot edit another user\'s review'}
  </>
}