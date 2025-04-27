import { FC, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks';
import { setMainNumberOfPlayers, UserSlice } from '../store/User/userSlice';
import { setNumberOfPlayersFromTheLocalStorage } from '../helpers/localstorage.helper';

const { setNumberOfPlayers } = UserSlice.actions;

const FirstPage: FC = () => {
  const dispatch = useAppDispatch();
  const [numberOfPlayers, setLocalNumberOfPlayers] = useState<number | 0>(0);

  return (
    <div className='h-screen flex flex-col justify-evenly'>
      <div className='flex flex-col justify-between items-center h-1/4 mt-auto'>
        <div className='text-8xl font-roboto font-bold'>
          <h2>Chooser</h2>
        </div>
      
        <div 
          className='flex flex-col text-4xl font-light' 
        >
          <h4>Let's have fun</h4>
        </div>
      </div>
      <div className='flex flex-col items-center justify-between mt-10 mb-auto'>
          <div className="input-wrapper">
              <label>Number of players (Max 8)</label>
              <input
                  type="number"
                  onChange={(e) => {
                      const newValue = +e.target.value;
                      setLocalNumberOfPlayers(newValue);
                  }}
                  required
                  className="w-full p-2 border rounded"
              />
          </div>
          <NavLink
            onClick={() => {
              if (numberOfPlayers) {
                setNumberOfPlayersFromTheLocalStorage("players", numberOfPlayers);
                dispatch(setNumberOfPlayers(numberOfPlayers));
                dispatch(setMainNumberOfPlayers(numberOfPlayers));
              }
            }}
            to={'/main'}
            className='flex w-fit mt-5 border-2 border-amber-50 px-10 py-1 rounded-md hover:bg-amber-50 hover:text-purple-600'
          > 
            <p className='text-2xl font-medium'>Start</p>
          </NavLink>
      </div>
    </div>
  )
}

export default FirstPage
