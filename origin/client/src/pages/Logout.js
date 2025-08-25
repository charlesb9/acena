import React, { useEffect } from 'react'
import { store } from '../store/store'
import { addNotification, setLogged } from '../store/userSlice'

function Logout() {

  useEffect(() => {
    const logout = () => {
      store.dispatch(setLogged(false))
      localStorage.removeItem('accessToken')
      window.location.replace('/')
    }
    logout()

  }, [])
  return (
    <div>Déconnexion...</div>
  )
}

export default Logout