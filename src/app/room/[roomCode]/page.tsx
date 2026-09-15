'use client'
import Canvas from '../../../components/Canvas';
export default function Room () {
    return <div className='bg-black h-screen w-screen flex items-center justify-center'>
        <Canvas className={'w-[50%] md:w-[35%] lg:[25%] aspect-square'}/>
    </div>
}