'use client'
import { socket } from '@/lib/socket';
import { SOCKET_EVENTS } from '@/shared/socket-events';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TextInput from './../components/Input';
export default function Home() {
  const [roomCode,setRoomCode]  = useState('')
  const [name,setName]  = useState('')
  const joinRoom = async () => {
    if(!socket.connected)
    {
      socket.connect()
    }
    if(!roomCode)
    {
      socket.emit(SOCKET_EVENTS.ROOM.CREATE,{
        name,
      })
    }
    else {
      socket.emit(SOCKET_EVENTS.ROOM.JOIN,{
        name,
        roomCode
      })
    }
  }
  const router = useRouter()
  useEffect(()=>{
    const handleRoomJoin  = ({roomCode } : {roomCode : string}) => {
        router.push(`/room/${roomCode}`)
    }

    socket.on(SOCKET_EVENTS.ROOM.CREATED,({
      roomCode
    }) => {
handleRoomJoin({roomCode})
    })
    socket.on(SOCKET_EVENTS.ROOM.JOINED,({
      roomCode
    }) => {
handleRoomJoin({roomCode})
    })
  },[])
  
  return (
    <div className="text-center flex justify-center items-center my-auto flex-col gap-2">
      <span className=" text-5xl text-white font-bold">
      Scribble
      </span>
      <TextInput name={'name'} label={"Name"} value={name} onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
      }}/>
      <TextInput name={'code'} label={"Room Code"} value={roomCode} capitalize maxLength={6} onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
        setRoomCode(e.target.value)
      }}/>
      <button disabled={!name || (roomCode.length < 6 && !!roomCode)} className='bg-purple-700 rounded-lg py-2 px-4 cursor-pointer disabled:bg-purple-950 disabled:cursor-not-allowed'
      onClick={joinRoom}>
        {roomCode ? "Join" : "Create"}
      </button>
    </div>
  );
}
