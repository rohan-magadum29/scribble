'use client';
import { useEffect } from 'react';
const WakeBackend = () => {
    let pinged = false;
    useEffect(() => {

        if(!pinged)
        {
            fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}`)
            pinged = true
        }

    },[])
  return (
    <></>
  )
}

export default WakeBackend