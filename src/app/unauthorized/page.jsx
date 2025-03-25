import React from 'react'
import Link from "next/link"

const unauthorized = () => {
  return (
    <div className='mt-16 bg-[whitesmoke] min-h-[60vh] text-center pt-16'>
        <div className='text-[3em] font-bold text-red-500'>403</div>
        <h1 className='mb-3 font-roboto text-black font-semibold'>You are not allowed to view this resource, that&apos;s all we know!</h1>
        <Link href='/' className='text-white bg-sky-500 p-2 rounded-lg text-lg bg'>Go Home</Link>
    </div>
  )
}

export default unauthorized