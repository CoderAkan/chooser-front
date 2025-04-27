import { FC, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Back, Logo } from '../components/icons';
import { store } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { ChangeTaskProperties } from '../store/User/userSlice';
import { MdOutlineCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import { setDifficultyLevelFromTheLocalStorage, getDifficultyLevelFromTheLocalStorage, setEliminationFromTheLocalStorage, getEliminationFromTheLocalStorage, setTimeToDoFromTheLocalStorage, getTimeToDoFromTheLocalStorage } from '../helpers/localstorage.helper';

const Settings: FC = () => {
  const state = store.getState();
  const dispatch = useAppDispatch();

  const elimination = getEliminationFromTheLocalStorage();
  const difficulty_level = getDifficultyLevelFromTheLocalStorage();
  const time_to_do = getTimeToDoFromTheLocalStorage();
  
  const [temp_elimination, set_temp_elimination] = useState<boolean>(elimination);
  const [temp_difficulty_level, set_temp_difficulty_level] = useState<number>(difficulty_level);
  const [temp_time_to_do, set_time_to_do] = useState<number>(time_to_do);
  const [saveChanges, setSaveChanges] = useState<boolean>(false)

  useEffect(() => {
    console.log(temp_elimination);
  }, [temp_elimination]);

  // Handle checkbox toggle for elimination
  const handleEliminationChange = () => {
    set_temp_elimination(!temp_elimination);
  };

  // Handle difficulty level selection
  const handleDifficultyClick = (level: number) => {
    set_temp_difficulty_level(level);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    set_time_to_do(parseInt(e.target.value));
  };

  const handleChanges = () => {
    const data = {
      elimination: temp_elimination, 
      difficulty_level: temp_difficulty_level, 
      time_to_do: temp_time_to_do
    }
    setDifficultyLevelFromTheLocalStorage("difficulty_level", temp_difficulty_level)
    setEliminationFromTheLocalStorage("elimination", temp_elimination)
    setTimeToDoFromTheLocalStorage("time_to_do", temp_time_to_do)
    dispatch(ChangeTaskProperties(data))
    setSaveChanges(true);
  };

  return (
    <div className='flex flex-col w-full h-screen'>
        <div className='flex ml-3 mr-3 mt-3 font-light text-3xl justify-between items-center mb-auto'>
            <NavLink to={'/main'} className='flex flex-col mr-auto justify-center items-center'>
                <Back />
            </NavLink>
            <div className='flex flex-col items-center mr-auto text-4xl'>
              Settings
            </div>
        </div>
        <div className='ml-auto mr-auto mb-auto text-2xl flex flex-col gap-y-6 justify-between w-4/5 max-w-md'>
          <div className='flex items-center justify-between'>
            <div>Elimination</div>
            <div className='cursor-pointer' onClick={handleEliminationChange}>
              {temp_elimination ? 
                <MdOutlineCheckBox className='w-8 h-8' /> : 
                <MdOutlineCheckBoxOutlineBlank className='w-8 h-8' />
              }
            </div>
          </div>
          
          <div className='flex items-center justify-between'>
            <div>Difficulty</div>
            <div className='flex gap-x-5 ml-4'>
              <div 
                id='diff_1'
                onClick={() => handleDifficultyClick(1)}
                className={`w-8 h-8 rounded-full cursor-pointer ${temp_difficulty_level >= 1 ? 'bg-white' : 'bg-gray-400'}`}
              ></div>
              <div 
                id='diff_2'
                onClick={() => handleDifficultyClick(2)}
                className={`w-8 h-8 rounded-full cursor-pointer ${temp_difficulty_level >= 2 ? 'bg-white' : 'bg-gray-400'}`}
              ></div>
              <div 
                id='diff_3'
                onClick={() => handleDifficultyClick(3)}
                className={`w-8 h-8 rounded-full cursor-pointer ${temp_difficulty_level >= 3 ? 'bg-white' : 'bg-gray-400'}`}
              ></div>
            </div>
          </div>
          
          <div className='flex items-center justify-between'>
            <div>Time to do</div>
            <div>
              <select 
                value={temp_time_to_do}
                onChange={handleTimeChange}
                className='bg-gray-700 text-white p-2 rounded'
              >
                {Array.from({length: 15}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center mt-6'>
            <button 
              onClick={handleChanges}
              className='flex w-fit mt-5 border-2 border-amber-50 px-10 py-1 rounded-md hover:bg-amber-50 hover:text-purple-600'
            >
              Save Changes
            </button>
            {saveChanges && (
              <div className='mt-4 text-green-400'>
                The changes were saved
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default Settings;