import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { addDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, usersDbRef } from './firebase-config/firebase-config'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'







function Login() {

    const provider = new GoogleAuthProvider;
    provider.setCustomParameters( {prompt: "select_account" } )
    const navigate = useNavigate()
    const [accountCreationActive,setAccountCreationActive] = useState(false);
    const [userName,setUserName]= useState("")
    const [info,setInfo] = useState({})



    async function handleLogin(){
        const userCredential= await signInWithPopup(auth,provider);
        const user = userCredential.user
        
        if( userCredential._tokenResponse.isNewUser ){

            Swal.fire({
                icon: "error",
                title: "User Not Found!",
                text: "Add UserName To Complete Setup...",
                confirmButtonColor: "black",
              });

            setAccountCreationActive(true);
            //   console.log(user)
            setInfo(user)            
        } else{     navigate("/")    }     
    }


    async function handleAddUser(){

        try {
            
            let string =  String(userName).trim();
        
        
        if(string===""){
            return  Swal.fire({
                icon: "error",
                title: "Empty Username!",
                confirmButtonColor: "black",
            });
        }
        
        // console.log(info)

        const docRef = doc(db, "users" , info.uid, )

        await setDoc(docRef, {
            'myUserAuthUID' : info.uid,
            'photoURL': info.photoURL,
            'email': info.email,
            "userName":string,
            "fullName": info.displayName,
            "createdAt": serverTimestamp(),
            } ) ;


         Swal.fire({
                title: "  User Added!",
                icon: "success",
                confirmButtonColor: "black",
              });

        
              navigate("/")

        } catch (error) {
            console.log(error)
        }


    }
   
  return (
    <div className='login-wrapper flex flex-col items-center p-4 '>

        <h1 className='underline text-2xl md:text-4xl'>Try Our Instant Google Login</h1>

        <p className='text-lg md:text-2xl'>  In order to use the watchlist and favorite capabilities of PhilMovieBox you will need to login to your account. If you do not have an account, registering for an account is free and simple.  <NavLink className="underline text-blue-800" to="/signup"> Click here</NavLink> to get started.
        </p>
        
        <div className='flex flex-col  w-full mt-4 gap-4' >
            <p className='text-left text-2xl md:text-4xl'>  Login :</p>

          { accountCreationActive && <> 
            <label htmlFor=""  className='text-center text-red-600 text-2xl md:text-4xl'> Add Username To Complete Setup:</label>
            <input onChange={(e)=>setUserName(e.target.value)} value={userName}  className='bg-gray-700 p-2 rounded-xl text-center text-white text-lg md:text-3xl font-afacad  ' type="text" placeholder='Type Username..'  />
            <button onClick={handleAddUser} className='py-1 text-2xl md:text-4xl bg-black w-[25%] mx-auto rounded-2xl text-red-600' >Add</button>
          </> }

            <button  onClick={handleLogin} className='py-1 text-2xl md:text-4xl bg-black text-white w-[70%] mx-auto rounded-2xl '> Instant Google Login  <i class="md:text-4xl fa-brands fa-google "></i>  </button>

        </div>

    </div>
  )
}

export default Login