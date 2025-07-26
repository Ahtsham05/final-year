import React from 'react'

const Loading = ({
  size = '10',
  weight = 4,
  height = '70vh' ,
  color = 'primary200' ,
  className = ''
}) => {
  return (
    <div className={`h-${height} w-full flex items-center justify-center`}>
          <div className={`border-gray-300 h-${size} w-${size} animate-spin rounded-full border-${weight} border-t-${color} ${className}`} />
    </div>
  )
}

export default Loading