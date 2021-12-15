import React from 'react'

const Stay = ({
  data: {
    city,
    country,
    superHost,
    title,
    rating,
    maxGuests,
    type,
    beds,
    photo,
  },
}) => {
  return (
    <article>
      <div className='img-container'>
        <img loading='lazy' src={photo} alt={title} />
      </div>
      <div className='stay-description d-flex'>
        {superHost && (
          <div className='stay-description--superhost'>SUPER HOST</div>
        )}
        <div className='stay-description--type'>
          {`${type} ${beds ? '. ' + beds + ' beds' : ''}`}
        </div>
        <div className='stay-description--rating d-flex'>
          <span className='material-icons'>star</span>
          {rating}
        </div>
      </div>
      <h3>{title}</h3>
    </article>
  )
}

export default Stay
