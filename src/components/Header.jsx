import React, { useState } from 'react'

const Input = ({ placeholder, name, ...others }) => (
  <div className='input-wrapper'>
    <input placeholder={placeholder} name={name} {...others} />
  </div>
)

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

const Header = () => {
  const [showSearch, setShowSearch] = useState(false)

  return (
    // <div className='search-wrapper'>
    <ConditionalWrapper
      condition={showSearch}
      wrapper={children => <div className='search-wrapper'>{children}</div>}
    >
      <header className={`d-flex`}>
        {/* <header className={`d-flex ${showSearch ? '' : 'search-wrapper'}`}> */}
        {/* <div className='search-wrapper'> */}
        <div className='logo'></div>
        <div className='search-container d-flex'>
          <Input
            name='location'
            placeholder='Add location'
            value='Helsinki, Finland'
          />
          <Input name='guests' placeholder='Add guests' />
          <div className='input-wrapper'>
            <button
              className='d-flex'
              onClick={() => setShowSearch(!showSearch)}
            >
              <span className='material-icons'>search</span>
            </button>
          </div>
        </div>
      </header>
    </ConditionalWrapper>
    // </div>
  )
}

export default Header
