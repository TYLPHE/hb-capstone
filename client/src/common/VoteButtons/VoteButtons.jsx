import { useEffect, useState } from 'react';
import './VoteButtons.css';
import { useLoaderData } from 'react-router-dom';

export default function VoteButtons() {
  const { votes_up, id } = useLoaderData();
  const [voteStatus, setVoteStatus] = useState(votes_up)

  useEffect(() => {
    setVoteStatus(votes_up);
  }, [votes_up])
  
  async function handleVote(bool) {
    let vote = bool;
    if (voteStatus === bool) {
      vote = null;
    }
    const request = await fetch('/api/review/vote', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id, vote }),
    });
    if (request.ok) {
      const response = await request.json();
      setVoteStatus(response.votes_up);
    }
  }
  
  return <div className="vote-container">
    <div className="vote-title">Rating</div>
    <div className="vote-buttons-container">
      <button 
        className={`upvote ${voteStatus ? 'voted' : ''}`}
        onClick={() => handleVote(true)}
      >
        🡅
      </button>
      <button 
        className={`downvote ${voteStatus===false ? 'voted' : ''}`}
        onClick={() => handleVote(false)}
      >
        🡇
      </button>
    </div>
  </div>
}