import { FC, useEffect, useState } from 'react'
import { filterTask, windowTask } from '../types/type'
import { tasks } from '../service/getTask';
import { useAppDispatch } from '../store/hooks';
import { ModalWindow, setNumberOfPlayers } from '../store/User/userSlice';
import { store } from '../store/store';

const TaskWindow: FC = () => {
    const [tasK, setTasK] = useState<windowTask>();
    const state = store.getState();
    const numberOfPlayers = state.user.numberOfPlayers;
    const dispatch = useAppDispatch();
    const filter_data: filterTask = {
        elimination: state.user.elimination,
        difficulty_level: state.user.difficulty_level,
        time_to_do: state.user.time_to_do
    }

    useEffect(() => {
        const data = tasks.getTask(filter_data);
        setTasK(data);
    }, [filter_data]);

    const handleWontComplete = () => {
        dispatch(setNumberOfPlayers(numberOfPlayers - 1));
        dispatch(ModalWindow(false))
    };

    const handleCompleted = () => {
        dispatch(ModalWindow(false))
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h3 className="text-lg font-medium mb-2">Task</h3>
                    <p className="text-gray-600 mb-4">
                        You need to do this and that...
                    </p>
                    <div className="flex justify-evenly space-x-3">
                        <button 
                            onClick={handleWontComplete}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-4 rounded"
                        >
                            Won't complete
                        </button>
                        <button 
                            onClick={handleCompleted}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                        >
                            Completed
                        </button>
                    </div>
                </div>
            </div>
  )
}

export default TaskWindow
