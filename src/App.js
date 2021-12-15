import React from 'react'

import './styles/index.scss'
import { Header, Stay } from './components'
import stays from './stays.json'

const App = () => {
  return (
    <div className='wrapper'>
      <Header />
      <main>
        <div className='information-container d-flex'>
          <h2>Stays in Finland</h2>
          <h5>12+ stays</h5>
        </div>
        <div className='stays-container d-flex'>
          {stays.map(stay => (
            <Stay key={stay.title} data={stay} />
          ))}
        </div>
      </main>
      <footer>
        created by <strong>lauris91</strong> - devChallenges.io
      </footer>
    </div>
  )
}

export default App
