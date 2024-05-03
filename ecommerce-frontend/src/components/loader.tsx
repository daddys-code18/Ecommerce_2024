import React from 'react'

const Loader = () => {
  return (
    <div className='loader'>
      ..loading
    </div>
  )
}

export default Loader
interface SkeletonProps{
  width?:string,length?:number
}

export const Skeleton =({width="unset",length=3}: SkeletonProps)=>{

    const Skeleton=  Array.from({length},(_,idx)=>
      <div  key={idx}className="skeleton-shape"></div>
      )
  return (
    <div className="skeleton-loader" style={{width}}>
     
     {Skeleton}
    </div>
  )
}