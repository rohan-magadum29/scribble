'use client';
import { httpClient } from "@/lib/httpClient";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Room () {
      const { roomCode } = useParams<{ roomCode: string }>();

    useEffect(() => {
        const getRoomData = async () => {
            const roomData = await httpClient(`/api/rooms/${roomCode}`)
            console.log({roomData}) 
        }
        getRoomData()
    },[])
    return <div className={"h-screen w-screen flex items-center justify-center"}>
        Room
        </div>
} 