import { FC } from 'react'
import { Outlet } from 'react-router-dom'

const Layout: FC = () => {
  return (
    <div className='h-screen w-screen flex flex-col justify-evenly items-center bg-gradient-to-r from-purple-800 to-purple-500 text-white'>
        <Outlet />
    </div>
  )
}

export default Layout
