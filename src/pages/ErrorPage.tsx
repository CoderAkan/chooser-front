import { FC } from 'react'
import { NavLink } from 'react-router-dom'

const ErrorPage: FC = () => {
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-r gap-y-8 from-purple-800 to-purple-500 text-white'>        
        <div className='text-8xl font-roboto font-bold'>404</div> 
        <NavLink to={'/'} className='ml-auto mr-auto border-2 border-amber-50 px-10 py-2 rounded-md hover:bg-amber-50 hover:text-purple-600'>
            <text className='text-2xl font-medium'>Back</text>
        </NavLink>
    </div>
  )
}

export default ErrorPage
