"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type Options = {
  username: string;
  numberOfClips: number,
  startDate: string;
  endDate: string;
}

export default function Home() {
  const [values, setValues] = useState<Options>({
      username: "",
      numberOfClips: 20,
      startDate: "",
      endDate: "",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues: Options) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className=' h-screen m-auto flex justify-center items-center flex-col'>
      <h1 className='text-6xl text-center'>Twitch Clip Rewind</h1>
      <p className='text-2xl text-center mb-3'>Look back in <b>time</b> at your best stream highlights</p>
      <div className='flex flex-col justify-center items-center mb-3'>
        <input onChange={handleChange} type="text" name="username" placeholder='Twitch Username' className='text-center mb-4 rounded border-solid border-4 border-green-500'/>
        <button className=''><Link href={{
                  pathname: "/rewind/" + values.username,
                  query: {
                    numberOfClips: values.numberOfClips,
                    startDate: values.startDate,
                    endDate: values.endDate
                  }
                }} prefetch={false} className='rounded border-solid border-4 border-green-500 bg-green-500 p-1'>Generate rewind</Link></button>
      </div>
        <h1 className='text-xl'><b>Optional settings:</b></h1>
        <p><b>Number of clips</b></p>
        <p>(Default 20 Max 100)</p>
        <input onChange={handleChange} type="number" name="numberOfClips" min={1} max={100} placeholder='20' className='text-center mb-4 rounded border-solid border-4 border-green-500'/>
        <h2><b>Time range</b></h2>
        <p>(Default all-time)</p>
        <p>Start date:</p>
        <input onChange={handleChange} type="date" name="startDate" className='text-center mb-4 rounded border-solid border-4 border-green-500'/>
        <p>End date:</p>
        <input onChange={handleChange} type="date" name="endDate" className='text-center mb-4 rounded border-solid border-4 border-green-500'/>
      </div>
     )
}
