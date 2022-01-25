import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { uniq, debounce, isEmpty } from 'lodash'

import { useOutsideClick } from '../hooks/useOutsideClick'
import WindBnBContext from '../context'
import stays from '../stays.json'

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

  const handleOnFocus = () => {
    setTimeout(() => {
      setShowOptions(true)
    }, 300)
  }

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
          onFocus={handleOnFocus}
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

export default LocationField
