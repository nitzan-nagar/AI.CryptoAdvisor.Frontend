import React from 'react'
import './Card.css'; 
import VoteButtons from '../VoteArea/VoteArea.jsx'; 

const Card = ({ title, cardType, children  }) => {
    return (
        <div className='card'>
            <h2 className='card-title'>{title}</h2>
                <div className='card-content'>
                    {children}
                </div>
            <VoteButtons voteOnType={cardType} />
            </div>
    )
}

export default Card