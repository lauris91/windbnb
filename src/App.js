import React, { useState, useCallback } from 'react'
import { isEmpty } from 'lodash'

import './styles/index.scss'
import { Header, Stay } from './components'
import places from './stays.json'
import { WindBnBContextProvider } from './context'

const App = () => {
  const [locationValue, setLocationValue] = useState('')
  const [guestsValue, setGuestsValue] = useState('')
  const [stays, setStays] = useState(places)

  const filterStays = useCallback(
    el => {
      const [city, country] = locationValue.split(', ')

      if (guestsValue && locationValue)
        return (
          el.city === city &&
          el.country === country &&
          +guestsValue <= el.maxGuests
        )

      if (guestsValue) return +guestsValue <= el.maxGuests
      if (locationValue) return el.city === city && el.country === country

      return []
    },
    [guestsValue, locationValue]
  )

  const handleSearch = useCallback(() => {
    const filteredStays = places.filter(filterStays)

    setStays(!isEmpty(filteredStays) ? filteredStays : places)
  }, [filterStays])

  return (
    <WindBnBContextProvider
      value={{
        locationValue,
        setLocationValue,
        guestsValue,
        setGuestsValue,
        handleSearch,
      }}
    >
      <div className='wrapper'>
        <Header />
        <main>
          <div className='information-container d-flex'>
            <h2>Stays in Finland</h2>
            <h5>{stays.length > 12 ? '12+' : stays.length} stays</h5>
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
    </WindBnBContextProvider>
  )
}

export default App
