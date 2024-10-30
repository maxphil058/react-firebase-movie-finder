import React, { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from './firebase-config/firebase-config';
import { getDoc,doc } from 'firebase/firestore';

function Profile() {
    
    const [myInfo, setMyInfo] = useState({});
    const {uid} = useParams();
    const [user,loading] = useAuthState(auth);
    const [overviewActive,setOverviewActive] = useState(false)

    useEffect(()=>{

        async function getMyInfo() {

            const docRef = doc(db, "users" , uid);
            let myDoc = await getDoc( docRef);
            // console.log(myDoc.data())
            setMyInfo(myDoc.data())
        }
        getMyInfo()

    },[uid]) 

    useEffect(()=>{
        console.log("rendered boss")
    },[])

    const [refresh,setRefresh] = useState(false)

    const doRefresh = () => {
        setRefresh(!refresh)
    }

    
    
    // Extract the month and year
    let monthsArr = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    const timeCreated = myInfo?.createdAt?.toDate();
    const myYear = timeCreated?.getFullYear() ;
    const myMonthID = timeCreated?.getMonth()
    const myMonth = monthsArr[myMonthID]



  


  return (
    <div className="profile-wrapper">
        <div className="profile-container flex justify-center items-center gap-4 py-8  md:py-10 bg-gray-900">

            <div className='w-[6rem] h-[6rem] md:w-[10rem] md:h-[10rem] overflow-hidden  rounded-[100%]' >
                <img className='object-cover h-full w-full' src={`${user?.photoURL}`} alt="profile-pic" />
            </div>

            <div>
                <p className='text-3xl  md:text-5xl  font-bold text-white' >{myInfo.userName}</p>
                <p className='text-gray-300  md:text-3xl'>Member since {myMonth} {myYear}</p>
            </div>
        </div>
        <div className="options-wrapper text-black py-2">
            <ul className='text-black flex flex-row gap-4 justify-around md:text-2xl'>

                <div className="overview-container relative">

                <NavLink to="account"  className={ ({isActive})=>  `text-black font-afacad ${ isActive && 'border-b-4 border-black ' }`} >Account <i class="fa-regular fa-user"></i> </NavLink>    


                </div>
                <NavLink onClick={()=>setOverviewActive(false)} to="watch-list" className={ ({isActive})=>  `text-black font-afacad ${ isActive && 'border-b-4 border-black ' }`}>WatchList <i class="fa-solid fa-list"></i></NavLink>    
                <NavLink onClick={()=>setOverviewActive(false)} to="favorites" className={ ({isActive})=>  `text-black font-afacad ${ isActive && 'border-b-4 border-black ' }`}>Favorites <i class="fa-regular fa-heart"></i></NavLink>    
            </ul>            
        </div>
        <div className='outlet-wrapper'>
            <Outlet  />
        </div>
    </div>
  )
}


export default Profile