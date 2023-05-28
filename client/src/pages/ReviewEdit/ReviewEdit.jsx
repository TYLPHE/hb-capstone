import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Flash from '../../common/Flash/Flash';
import './ReviewEdit.css';

export default function ReviewEdit() {
  const { id, review, owner, reviewed } = useLoaderData();
  const [value, setValue] = useState(review);
  const [msg, setMsg] = useState(null);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);

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
      return <button className='save-button' disabled>Save & Update Review</button>
    } else {
      return <button className='save-button' onClick={handleUpdate}>Save & Update Review</button>
    }
  }
  
  function Publish() {
    const [active, setActive] = useState(false);
    
    return <div className='publish-container'>
      <button 
        onMouseOver={() => setActive(true)}
        onMouseOut={() => setActive(false)}
        className='save-button' 
      >
        Publish
      </button>
      <div 
        className={`publish-popup ${active ? "popup" : ""}`}
        onMouseOver={() => setActive(true)}
        onMouseOut={() => setActive(false)}        
      >
        Publishing will allow other users to see your review.
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
      <UpdateButton />
      <Publish />
    </div>

    {owner ? <MDEditor 
      value={value} 
      onChange={ (e) => handleValue(e) } 
      previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
      height={800}
    /> : 'You cannot edit another user\'s review'}
  </>
}