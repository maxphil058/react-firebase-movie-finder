import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, usersDbRef } from './firebase-config/firebase-config'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Outlet, useNavigate } from 'react-router-dom'
import { arrayRemove } from 'firebase/firestore'
import { NavLink } from 'react-router-dom'



function WatchList() {

  const [user] = useAuthState(auth)
  const [info,setInfo]= useState({})
  const [movieIdArr,setMovieIdArr] = useState([]) 
  const [watchList,setWatchList]= useState([])

  const navigate = useNavigate()

  return (
    
<div className="watchlist-wrapper text-black py-2 ">
    <div className='flex flex-row gap-8 justify-around md:text-xl'>
        <p className='font-bold text-black font-afacad  text-lg md:text-2xl ' >My Watchlist</p>

        <div className='flex flex-row gap-8'>
            <NavLink to="movies" className={ ({isActive})=>  `text-black font-afacad ${ isActive && 'border-b-4 border-black ' }`} >MOVIES</NavLink>
            <NavLink to="tv"  className={ ({isActive})=>  `text-black font-afacad ${ isActive && 'border-b-4 border-black ' }`}   >TV</NavLink>
        </div>
    </div>

    

      <div className='all-watchlist-wrapper' >
        <Outlet/>
      </div>


</div>
  )
}

export default WatchList