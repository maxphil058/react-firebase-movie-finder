// import React, { useState } from 'react'
import { auth } from './firebase-config/firebase-config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState } from 'react'
import { deleteDoc, doc } from 'firebase/firestore'
import { updateDoc } from 'firebase/firestore'
import { db } from './firebase-config/firebase-config'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { GoogleAuthProvider, deleteUser, reauthenticateWithPopup } from 'firebase/auth'


function ProfileSettings() {
    
    const [user] = useAuthState(auth)
    const navigate = useNavigate()
    const [ userNameActive,setUserNameActive] = useState(false)

    const [username,setUsername] = useState("")
    const [confirmUsername,setConfirmUsername] = useState("")

    
    async function changeUserName (){


        try {
            if(username !== confirmUsername ){
                return Swal.fire({
                    icon: "error",
                    title: "Usernames are not the same!",
                    confirmButtonColor: "black",
                });
            }

            const docRef = doc(db, "users", user?.uid);
            await updateDoc( docRef ,  {userName : username })

            
        } catch (error) {
            console.log(error)
        }


        setUserNameActive(false)
        navigate(`/`)


    }

    async function removeUser(){
      try {
        const docRef = doc(db, "users", user?.uid);
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user , provider)
        await deleteDoc( docRef)
        await deleteUser(user);
        navigate("/")
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='profile-settinga-wrapper font-afacad'>
    
        <p className='text-center text-3xl md:text-4xl underline mb-4'>Edit Profile</p>

        <div className='flex flex-row justify-around items-center md:text-2xl ' >
            <button className="bg-red-600 p-3 uppercase rounded-xl" onClick={removeUser} >Delete User</button>
            <button className="bg-gray-400 p-3  uppercase rounded-xl " onClick={()=>setUserNameActive(!userNameActive)}>Change Username </button>
        </div>

        <div className='p-4 text-gray-800 cursor-not-allowed'>
            <p className='text-2xl md:text-3xl'>  Current Email</p>
            <div  className='border-4 border-gray-800 rounded-lg py-2 text-xl md:text-3xl text-center'>{user?.email}</div>
        </div>

        {userNameActive && <div className='p-4 text-gray-800 flex flex-col gap-4 border-t-4 border-black '>
            <p className='text-2xl text-red-600'>  Change Username</p>
            <input  value={username} onChange={(e)=>setUsername(e.target.value)} className='border-4 border-gray-800 rounded-lg py-2 text-xl text-center w-full'/>

            <p className='text-2xl text-red-600'>  Confirm Username</p>
            <input value={confirmUsername} onChange={(e)=>setConfirmUsername(e.target.value)} className='border-4 border-gray-800 rounded-lg py-2 text-xl text-center w-full'/>

            <button onClick={changeUserName} className='text-2xl p-3 px-4 mx-auto w-[40%]  bg-gray-800 text-white  uppercase rounded-xl '> Save</button>
        </div>}

        
    </div>
  )
}

export default ProfileSettings