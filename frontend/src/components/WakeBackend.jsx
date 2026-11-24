'use client';
import { httpClient } from '@/lib/httpClient';
import { useEffect, useState } from 'react';
const WakeBackend = ({
  children
}) => {
  const [serverOn,setServerOn] = useState(null)
  const [errorCount,setErrorCount] = useState(0)
    useEffect(() => {
            setServerOn(JSON.parse(sessionStorage.getItem('serverOn')))
      let timeout = null
        if(!serverOn)
        {
            httpClient().then(() => {
              setServerOn(true)
              sessionStorage.setItem('serverOn',true)
            }).catch(() => {
              setServerOn(false)
              sessionStorage.setItem('serverOn',false)
              timeout = setTimeout(() => {
                setErrorCount(prev => prev+1)
              },10000)
            })
            
        }
        return () => {
          clearTimeout(timeout)
        }
    },[errorCount])
    if(serverOn === null)
      {
        return null
      } 
  return (
    <div className='flex items-center justify-center w-full h-full '>
      
        {serverOn  ? children :  <span className='text-2xl animate-pulse'>Waking Up Backend..</span> }</div>
  )
}

export default WakeBackend