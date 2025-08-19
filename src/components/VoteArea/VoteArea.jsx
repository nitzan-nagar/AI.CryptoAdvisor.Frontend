const VoteButtons = ({ voteOnType, votedCards, handleVote }) => {

  return (
    <div className="vote-area">
      {votedCards[voteOnType] !== undefined ? (
        <p className="vote-saved-message">  Vote saved successfully!</p>
      ) : (
        <>
          <button onClick={() => handleVote(voteOnType, true)}>👍</button>
          <button onClick={() => handleVote(voteOnType, false)}>👎</button>
        </>
      )}
    </div>
  );
}

export default VoteButtons;
