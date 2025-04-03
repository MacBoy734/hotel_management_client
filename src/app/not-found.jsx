import React from 'react'
import Link from "next/link"

const notFoundPage = () => {
  return (
    <div className='bg-[whitesmoke] min-h-[60vh] text-center pt-16'>
        <div className='text-[4em] font-bold text-red-500'>404</div>
        <div className='text-3xl font-bold text-red-500 my-2'>Not Found!</div>
        <h1 className='mb-3 font-roboto text-black font-semibold'>This Page / Resource Was Not Found! That&apos;s all we know!</h1>
        <Link href='/' className='text-white bg-sky-500 p-2 rounded-lg text-lg bg'>Go Home</Link>
    </div>
  )
}

export default notFoundPage