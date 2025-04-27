import { FC } from 'react'
import { FaGamepad } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";




export const Logo: FC = () => {
  return (
    <div>
      <FaGamepad className='w-10 h-10'/>
    </div>
  )
}

export const Settings: FC = () => {
    return (
        <div>
            <IoIosSettings className='w-10 h-10'/>
        </div>
    )
}

export const Back: FC = () => {
  return (
      <div>
          <FaArrowLeft className='w-10 h-10'/>
      </div>
  )
}


<FaArrowLeft />
