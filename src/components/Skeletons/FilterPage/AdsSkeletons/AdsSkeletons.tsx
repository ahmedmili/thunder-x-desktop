




import React from 'react'
import './adsSkeletons.scss'
import { Skeleton } from '@mui/material'

const AdsSkeletons = () => {
  return (
    <div className="ads" >
      <Skeleton variant="rectangular" style={{ borderRadius:'10px'}} height={230} width={'30%'} />
      <Skeleton variant="rectangular" style={{ borderRadius:'10px'}} height={230} width={'30%'} />
      <Skeleton variant="rectangular" style={{ borderRadius:'10px'}} height={230} width={'30%'} />
    </div>
  )
}
export default AdsSkeletons