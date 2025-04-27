import { FC, useState, useEffect, useRef } from 'react'
import { Logo, Settings } from '../components/icons'
import { NavLink } from 'react-router-dom'
import { store } from '../store/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ModalWindow, setMainNumberOfPlayers, setNumberOfPlayers } from '../store/User/userSlice';
import TaskWindow from '../components/taskWindow';
import { tasks } from '../service/getTask';
import { filterTask, windowTask } from '../types/type';
import { getNumberOfPlayersFromTheLocalStorage, setNumberOfPlayersFromTheLocalStorage } from '../helpers/localstorage.helper';


const MainPage: FC = () => {
  const state = store.getState();
  const dispatch = useAppDispatch();
  // Use useAppSelector to get the latest state
  const currentNumberOfPlayers = useAppSelector(state => state.user.numberOfPlayers);
  const elimination = state.user.elimination;
  const colors_300 = ['bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-pink-300', 'bg-yellow-300', 'bg-orange-300', 'bg-teal-300', 'bg-lime-300']
  const colors_500 = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-orange-500', 'bg-teal-500', 'bg-lime-500']

  const [activeHolds, setActiveHolds] = useState<Set<number>>(new Set());
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);
  // Add countdown state
  const [countdown, setCountdown] = useState<number | null>(null);
  // Track player statuses
  const [playerStatuses, setPlayerStatuses] = useState<Record<number, string>>({});
  // Add state for showing the completion modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [tasK, setTasK] = useState<windowTask>();
  
  // Reference to store modal timeout
  const modalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Store original player count
  const originalPlayerCountRef = useRef<number>(state.user.mainNumberOfPlayers);
  
  const activeHoldsRef = useRef<Set<number>>(new Set());
  const holdTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  // Add ref for countdown intervals
  const countdownIntervalsRef = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  async function fetchTaskData() {
    const filter_data: filterTask = {
      elimination: state.user.elimination,
      difficulty_level: state.user.difficulty_level,
      time_to_do: state.user.time_to_do
    };
    try {
      const response = await fetch('http://localhost:3000/api/task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify(filter_data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      setTasK(data);
  
    } catch (error) {
      console.error("Error fetching task:", error);
      alert('Failed to fetch task. See console for details.');
    }
  }

  useEffect(() => {
    // Store the original number of players for reset
    originalPlayerCountRef.current = state.user.mainNumberOfPlayers;
  }, [state.user.mainNumberOfPlayers]);

  useEffect(() => {
    activeHoldsRef.current = activeHolds;
  }, [activeHolds]);

  const handleMouseDown = (index: number) => {
    if (isSelectionComplete) return;
    
    setActiveHolds(prev => {
      const newActiveHolds = new Set(prev);
      newActiveHolds.add(index);
      return newActiveHolds;
    });
    
    if (holdTimersRef.current[index]) {
      clearTimeout(holdTimersRef.current[index]);
    }
    
    // Set initial countdown for this player
    setCountdown(3);
    // Clear any existing interval
    if (countdownIntervalsRef.current[index]) {
      clearInterval(countdownIntervalsRef.current[index]);
    }
    
    // Set up countdown interval
    countdownIntervalsRef.current[index] = setInterval(() => {
      setCountdown(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(countdownIntervalsRef.current[index]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    holdTimersRef.current[index] = setTimeout(() => {
      if (activeHoldsRef.current.has(index)) {
        const participatingPlayers = Array.from(activeHoldsRef.current);
        
        if (participatingPlayers.length > 0) {
          const randomIndex = Math.floor(Math.random() * participatingPlayers.length);
          const selectedPlayer = participatingPlayers[randomIndex];
          const newPlayerStatuses = {...playerStatuses};
          
          participatingPlayers.forEach(playerIndex => {
            if (playerIndex !== selectedPlayer) {
              newPlayerStatuses[playerIndex] = "You Lost!";
            } else {
              newPlayerStatuses[playerIndex] = `Player ${playerIndex + 1} lost`;
            }
          });

          fetchTaskData()
          setPlayerStatuses(newPlayerStatuses);
          
          setSelectedPlayerIndex(selectedPlayer);
          setIsSelectionComplete(true);
          
          // Clear all timers and intervals
          Object.values(holdTimersRef.current).forEach(timer => clearTimeout(timer));
          Object.values(countdownIntervalsRef.current).forEach(interval => clearInterval(interval));
          holdTimersRef.current = {};
          countdownIntervalsRef.current = {};
          
          // Reset countdown
          setCountdown(null);
          
          // Set a timeout to show the completion modal after 2 seconds
          // Store the timeout reference so we can clear it if needed
          if (modalTimeoutRef.current) {
            clearTimeout(modalTimeoutRef.current);
          }

          
          modalTimeoutRef.current = setTimeout(() => {
            setShowCompletionModal(true);
          }, 2000);
        }
      }
    }, 3000);
  };

  const handleMouseUp = (index: number) => {
    if (isSelectionComplete) return;
    
    if (holdTimersRef.current[index]) {
      clearTimeout(holdTimersRef.current[index]);
      delete holdTimersRef.current[index];
    }
    
    if (countdownIntervalsRef.current[index]) {
      clearInterval(countdownIntervalsRef.current[index]);
      delete countdownIntervalsRef.current[index];
    }
    
    setActiveHolds(prev => {
      const newActiveHolds = new Set(prev);
      newActiveHolds.delete(index);
      return newActiveHolds;
    });
    
    // Reset countdown if no active holds
    if (activeHolds.size <= 1) {
      setCountdown(null);
    }
  };

  const playingAgain = () => {
    // Clear the modal timeout to prevent it from showing up
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    
    setActiveHolds(new Set<number>());
    activeHoldsRef.current = new Set<number>();
    setSelectedPlayerIndex(null);
    setIsSelectionComplete(false);
    setCountdown(null);
    setPlayerStatuses({});
    setShowCompletionModal(false);
    dispatch(ModalWindow(false));
    
    // Clean up any remaining timers
    Object.values(holdTimersRef.current).forEach(timer => clearTimeout(timer));
    Object.values(countdownIntervalsRef.current).forEach(interval => clearInterval(interval));
    holdTimersRef.current = {};
    countdownIntervalsRef.current = {};
  };

  useEffect(() => {
    // Check if player count has reached zero
    if (currentNumberOfPlayers <= 0) {
      // Reset to original player count
      dispatch(setNumberOfPlayers(originalPlayerCountRef.current));
      // Update localStorage too
      setNumberOfPlayersFromTheLocalStorage("players", originalPlayerCountRef.current);
    }
    
    return () => {
      playingAgain();
      // Cleanup on component unmount
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
      Object.values(holdTimersRef.current).forEach(timer => clearTimeout(timer));
      Object.values(countdownIntervalsRef.current).forEach(interval => clearInterval(interval));
    };
  }, [currentNumberOfPlayers, dispatch]);

  const handleWontComplete = () => {
    // Calculate new player count
    const newPlayerCount = currentNumberOfPlayers > 1 ? currentNumberOfPlayers - 1 : 1;
    
    // Dispatch action to update Redux store
    dispatch(setNumberOfPlayers(newPlayerCount));
    
    // Also update localStorage to persist the change
    setNumberOfPlayersFromTheLocalStorage("players", newPlayerCount);
    
    // Close modal and reset game state
    setShowCompletionModal(false);
    playingAgain();
  };

  const handleCompleted = () => {
    setShowCompletionModal(false);
    playingAgain();
  };

  return (
    <div className='flex flex-col w-full h-screen'>
        <div className='flex ml-3 mr-3 mt-3 font-light text-3xl justify-between items-center mb-auto'>
            <NavLink to={'/'} className='flex flex-col mr-auto justify-center items-center'>
                <Logo />
                Chooser
            </NavLink>
            <NavLink to={'/settings'} className='flex flex-col ml-auto justify-center items-center'>
                <Settings />
                Settings
            </NavLink>
        </div>
        <div className={`grid gap-8 mb-auto mx-4 ${
            currentNumberOfPlayers <= 2 ? 'grid-cols-2 grid-rows-1' :
            currentNumberOfPlayers <= 4 ? 'grid-cols-2 grid-rows-2' :
            currentNumberOfPlayers <= 6 ? 'grid-cols-2 grid-rows-3' :
            'grid-cols-2 grid-rows-4'
        }`}>
            {Array.from({length: currentNumberOfPlayers}).map((_, index) => (
                <div 
                    key={index}
                    onMouseDown={() => handleMouseDown(index)}
                    onMouseUp={() => handleMouseUp(index)}
                    onMouseLeave={() => handleMouseUp(index)}
                    onTouchStart={() => handleMouseDown(index)}
                    onTouchEnd={() => handleMouseUp(index)}
                    onTouchCancel={() => handleMouseUp(index)}
                    className={`p-4 rounded cursor-pointer transform transition-all duration-300 select-none ${
                        isSelectionComplete && selectedPlayerIndex !== index ? 'opacity-0 scale-0' : 
                        activeHolds.has(index) ? colors_500[index] : colors_300[index]
                    }`}
                    style={{
                        transition: 'opacity 300ms, transform 300ms',
                        userSelect: 'none',
                    }}
                >
                    <div className="w-full h-20 flex items-center justify-center text-lg font-medium">
                        {isSelectionComplete ? 
                            playerStatuses[index] || `Player ${index + 1}` :
                            activeHolds.has(index) ? 
                                "Holding..." : 
                                `Player ${index + 1}`
                        }
                    </div>
                </div>
            ))}
        </div>
        {!isSelectionComplete && activeHolds.size > 0 && countdown !== null && (
            <div className="text-center text-2xl font-bold mt-4">
                {countdown === 0 ? "Time's up!" : `${countdown} seconds left`}
            </div>
        )}
        {isSelectionComplete && !showCompletionModal && (
            <div className="flex justify-center mb-8">
                <button 
                    onClick={playingAgain}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    Let's play again
                </button>
            </div>
        )}
        
        {/* Completion Modal */}
        {showCompletionModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h3 className="text-lg text-gray-600 font-medium mb-2">{tasK?.title}</h3>
                    <div className='flex'></div>
                    <p className="text-gray-600 mb-1">
                        {tasK?.description}
                    </p>
                    <p className="text-gray-600 mb-4">
                        {`You have ${state.user.time_to_do} minutes to do this`}
                    </p>
                    {elimination ? (<div className="flex justify-evenly space-x-3">
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
                    </div>) : (
                        <button 
                            onClick={handleCompleted}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                        >
                            Play again
                        </button>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default MainPage;