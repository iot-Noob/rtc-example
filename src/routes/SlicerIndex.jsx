import React from 'react'
import { lazy } from 'react'
import Navbar from '../Elements/Navbar'
const Component=lazy(()=>import("./Component"))
export const SlicerIndex = () => {
  return (
    <>
    <Navbar/>
    <Component/>
    </>
  )
}
