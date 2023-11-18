import { LogIn } from './slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from './slices/store';
import {useEffect, useState } from 'react';
export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const username_ = useAppSelector((state)=> state.authReducer.value.username)
  const [ username , setUsername ] = useState('');
  
  if(username_ !== ''){
    setTimeout(()=>{
      window.location.replace("/players");
    }, 100)
  }
  const setUserName = () =>{
    dispatch(LogIn(username));
    setTimeout(()=>{
      window.location.assign('/players');
    },100)
  }
  useEffect(()=>{
    if(username_ !== '') window.location.assign('/players')
  })
  return (
    <div className='w-fit h-fit mx-auto py-56'>
      <div className='text-center text-xl w-fit mx-auto text-white py-4'>
        Hello! Welcome from this page! 
      </div>
      <>
        <input id='username' type="text" className='input block input-ghost border-white border-2 mx-auto' placeholder='username' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
        <button className='btn btn-success my-3 w-3/4' onClick={setUserName}>Start now!</button>
      </>
    </div>
  )
}
