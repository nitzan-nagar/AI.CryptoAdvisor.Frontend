import React from 'react'
import './VoteArea.css';

const VoteArea = ({ voteOnType }) => {
  return (
    <div className="vote-area">
      <button onClick={() => onVote(voteOnType, 1)}>👍</button>
      <button onClick={() => onVote(voteOnType, -1)}>👎</button>
    </div>
  )
}

export default VoteArea