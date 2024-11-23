import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { path } from '../../ultils/constants'
import { Outlet } from 'react-router-dom'

const System = () => {
  // const {isLoggedIn } = useSelector(state => state.auth)

  // if(!isLoggedIn)
  //   return <Navigate to={`/${path.LOGIN}`} replace={true} />

  return (
    <div>
      <h1>admin page</h1>
      <Outlet />
    </div>
  )
}

export default System