import { createContext } from 'react'

const WindBnBContext = createContext(null)

export const {
  Provider: WindBnBContextProvider,
  Consumer: WindBnBContextContextConsumer,
} = WindBnBContext

export default WindBnBContext
