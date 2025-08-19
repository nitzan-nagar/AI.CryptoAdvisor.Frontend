import React from 'react';
import './Card.css'; 
import VoteButtons from '../VoteArea/VoteArea.jsx'; 

const Card = ({ title, cardType, children, votedCards, handleVote }) => {
    return (
        <div className='card'>
            <h2 className='card-title'>{title}</h2>
            <div className='card-content'>
                {children}
            </div>
            <div style={{ marginTop: 'auto' }}>
                <VoteButtons 
                    voteOnType={cardType} 
                    votedCards={votedCards} 
                    handleVote={handleVote} 
                />
            </div>
        </div>
    )
}

export default Card;