// import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'


function App() {
  const [time, setTime] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [numberOfClicks, setNumberOfClicks] = useState(0);

  useEffect(() => {
    console.log("CLICK", numberOfClicks);
  }, [numberOfClicks]);


  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
        setCurrentTime(time)
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(600); // Reset timer to 10 minutes
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
 
  const [check, setCheck] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/get')
    .then(res => setCheck(res.data));
    
    // console.log(check[0]._id);
    console.log(currentTime)
  }, [])

  useEffect(() => {
    // const topId = check[0]._id;
    const topId = '64036a48bb6c4d52adc64cc4';

    // console.log(topId);
    const timeData = {
      currentTime: currentTime,
    }

    axios.put(`http://localhost:8000/put/${topId}`, timeData)
    .then(() => console.log('Updated'))
    .catch(err => console.log(err));
  }, [currentTime]);

  const handleClick = (e) => {
    const maxCount  = check[0].Clicks ;
    const topId = check[0]._id ;
    // const topId = '64035e73e75c25b4000cc549';
    resetTimer();

    setNumberOfClicks(numberOfClicks  + 1);

    const clickCount = {
      Clicks: numberOfClicks,
    }
  
    axios.put(`http://localhost:8000/put/${topId}`, clickCount)
    .then(() => console.log('Updated'))
    .catch(err => console.log(err));

    const dummyState = {
      lastReset: currentTime,
    };
    console.log(currentTime);
    // const check = currentTime;

    axios.post('http://localhost:8000/post', dummyState)
    .then(() => console.log('added'))
    .catch((err => console.log(err)))
  }

  return (
    <div>
      <p className='timer'>{formatTime(time)}</p>
      <button onClick={startTimer} >Start</button>
      <button onClick = {(e) => { handleClick(e)}}>Reset</button>
    </div>
  );

}

export default App;
