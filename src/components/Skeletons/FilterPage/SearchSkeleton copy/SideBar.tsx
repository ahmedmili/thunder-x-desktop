




import React from 'react'
import './sideBar.scss'
import { Skeleton } from '@mui/material'

const SideBar = () => {
  return (
    <div className="left-side" >
      <Skeleton variant="rectangular" height={1499} width={279} style={{
        borderRadius: "15px"
      }} />

    </div>
  )
}
export default SideBar