




import React from 'react'
import './searchSkeletons.scss'
import { Skeleton } from '@mui/material'

const SearchSkeletons = () => {
  return (
    <div className="search-bar" >
      <Skeleton variant="rectangular" height={57} width={'93%'} style={{
        backgroundColor: "#B2E9F0",
        borderRadius: "10px"
      }}
      />
      {/* <Skeleton height={75} style={{
      flex: '1',
      backgroundColor: "##1F94A4"
    }} /> */}
    </div>
  )
}
export default SearchSkeletons