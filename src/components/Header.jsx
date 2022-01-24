import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { uniq, debounce, isEmpty } from 'lodash'

import WindBnBContext from '../context'
import stays from '../stays.json'
import { useOutsideClick } from '../hooks/useOutsideClick'

const LocationField = ({
  placeholder,
  name,
  showDescription,
  onChange,
  onClick,
  ...others
}) => {
  const [options, setOptions] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const { locationValue } = useContext(WindBnBContext)
  const locationRef = useRef(null)
  const optionsRef = useRef(null)

  const loadOptions = useCallback(() => {
    const filteredLocations = stays
      .filter(loc => {
        const fullLocation = `${loc.city}, ${loc.country}`.toLocaleLowerCase()

        return fullLocation.includes(locationValue.toLocaleLowerCase())
      })
      .map(({ city, country }) => `${city}, ${country}`)

    return uniq(filteredLocations)
  }, [locationValue])

  useOutsideClick(locationRef, () => setShowOptions(false), optionsRef)

  useEffect(() => {
    const debouncedOptions = debounce(() => {
      setOptions(loadOptions())
    }, 300)

    debouncedOptions()
  }, [locationValue, loadOptions])

  return (
    <>
      <div className='input-wrapper' ref={locationRef}>
        {showDescription && (
          <span className='input-wrapper--description'>Location</span>
        )}
        <input
          placeholder={placeholder}
          onChange={event => {
            const {
              target: { value },
            } = event

            onChange(value)
          }}
          onClick={onClick}
          name={name}
          value={locationValue}
          autoComplete='off'
          onFocus={() => setShowOptions(true)}
          onKeyDown={({ key }) => key === 'Tab' && setShowOptions(false)}
          {...others}
        />
      </div>
      {showOptions && (
        <div className='options-container' ref={optionsRef}>
          {!isEmpty(options) &&
            options.map((opt, i) => (
              <div
                className='options-container--option'
                key={i}
                onClick={() => {
                  onChange(opt)
                  setShowOptions(false)
                }}
              >
                <span className='material-icons'>location_on</span>
                <div>{opt}</div>
              </div>
            ))}
        </div>
      )}
    </>
  )
}

const GuestsField = ({
  placeholder,
  name,
  showDescription,
  onClick,
  ...others
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)

  const { guestsValue, setGuestsValue } = useContext(WindBnBContext)
  const guestsRef = useRef(null)
  const optionsRef = useRef(null)

  useOutsideClick(guestsRef, () => setShowOptions(false), optionsRef)

  const updateAdults = useCallback(
    (action = 'add') => {
      if (action === 'add') {
        setAdults(adults + 1)
        return
      }

      if (adults !== 0) {
        setAdults(adults - 1)
        return
      }

      return
    },
    [adults]
  )

  const updateChildren = useCallback(
    (action = 'add') => {
      if (action === 'add') {
        setChildren(children + 1)
        return
      }

      if (children !== 0) {
        setChildren(children - 1)
        return
      }

      return
    },
    [children]
  )

  const value = useMemo(() => {
    const guests = adults + children
    if (guests > 0) return `${guests}`

    return ''
  }, [adults, children])

  useEffect(() => setGuestsValue(value), [value, setGuestsValue])

  return (
    <>
      <div className='input-wrapper' ref={guestsRef}>
        {showDescription && (
          <span className='input-wrapper--description'>Guests</span>
        )}
        <input
          placeholder={placeholder}
          onClick={onClick}
          name={name}
          // onFocus={handleOnFocus}
          onFocus={() => setShowOptions(true)}
          onChange={() => {
            return null
          }}
          id='guests-input'
          autoComplete='off'
          value={guestsValue ? `${guestsValue} guests` : ''}
          onKeyDown={({ key }) => {
            if (key === 'Backspace') {
              adults && setAdults(0)
              children && setChildren(0)
            }
          }}
          {...others}
        />
      </div>
      {showOptions && (
        <div className='options-container' ref={optionsRef}>
          <div className='options-container--option guests'>
            <div className='guests--type'>Adults</div>
            <div className='guests--ages'>Ages 13 or above</div>
            <div className='guests--count'>
              <span
                className='material-icons'
                onClick={() => updateAdults('remove')}
              >
                remove
              </span>
              {adults}
              <span className='material-icons' onClick={() => updateAdults()}>
                add
              </span>
            </div>
          </div>
          <div className='options-container--option guests'>
            <div className='guests--type'>Children</div>
            <div className='guests--ages'>Ages 2 - 12</div>
            <div className='guests--count'>
              <span
                className='material-icons'
                onClick={() => updateChildren('minus')}
              >
                remove
              </span>
              {children}
              <span className='material-icons' onClick={() => updateChildren()}>
                add
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const Header = () => {
  const [showSearch, setShowSearch] = useState(false)
  const { setLocationValue, handleSearch } = useContext(WindBnBContext)
  const searchContainerRef = useRef(null)

  const toggleSearch = useCallback(state => {
    setShowSearch(state)
  }, [])

  useOutsideClick(searchContainerRef, () => toggleSearch(false))

  return (
    <header className={`header ${showSearch ? 'header-expanded' : ''}`}>
      {showSearch && (
        <div className='d-flex edit-search-row'>
          Edit your search
          <span className='material-icons' onClick={() => toggleSearch(false)}>
            close
          </span>
        </div>
      )}
      <div className='logo'></div>
      <div className='search-container d-flex' ref={searchContainerRef}>
        <LocationField
          name='location'
          placeholder='Add location'
          onChange={val => setLocationValue(val)}
          onClick={() => {
            if (!showSearch) toggleSearch(true)
          }}
          showDescription={showSearch}
        />
        <GuestsField
          name='guests'
          placeholder='Add guests'
          onClick={() => {
            if (!showSearch) toggleSearch(true)
          }}
          showDescription={showSearch}
        />
        <div className='input-wrapper search-btn'>
          <button
            className='d-flex'
            onClick={() => {
              if (showSearch) toggleSearch(false)
              handleSearch()
            }}
          >
            <span className='material-icons'>search</span>
            {showSearch && 'Search'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
