import React from 'react'

const CardSkeleton = () => {
  return (
    <div className="flex w-64 flex-col gap-4">
      <div className="skeleton h-36 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  )
}

export default CardSkeleton
