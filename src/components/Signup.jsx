import React, { useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db, usersDbRef } from './firebase-config/firebase-config'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { setDoc } from 'firebase/firestore'

function Signup() {

    const [userName,setUserName] = useState("")
    const provider = new GoogleAuthProvider;
    provider.setCustomParameters({prompt: "select_account" });
    const navigate = useNavigate()

    
    async function handleSignUp (){
       try {
        
        let string =  String(userName).trim();
        
        if(string===""){
            return 
        }
        
        const userCredential= await signInWithPopup(auth,provider);
        let info = userCredential.user;
        



                    if(userCredential._tokenResponse.isNewUser ){
                        


                        const docRef = doc(db, "users" , info.uid, )

                        await setDoc(docRef, {
                            'myUserAuthUID' : info.uid,
                            'photoURL': info.photoURL,
                            'email': info.email,
                            "userName":string,
                            "fullName": info.displayName,
                          "createdAt":serverTimestamp()  } ) ;


                         Swal.fire({
                                title: "  User Added!",
                                icon: "success",
                                confirmButtonColor: "black",
                              });

                              navigate("/login")

                        } else{

                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Email Already Added!",
                                confirmButtonColor: "black",
                              });

                            
                        }

        

       } catch (error) {
        console.log(error);

       }

    }


  return (
    <div className='signup-wrappper mt-4 gap-2 px-2 flex flex-col items-center justify-center '>
        <h1 className='underline text-3xl md:text-4xl'> Sign up for an account</h1>
        <p className=' text-2xl md:text-3xl'>Signing up for an account is free and easy. Fill out the form below to get started. </p>


        <div className='flex flex-col  w-full mt-4 gap-4 mb-4  ' >

            <label htmlFor=""  className='text-left text-3xl md:text-4xl'>  Username</label>
            <input onChange={(e)=>setUserName(e.target.value)} value={userName}  className='bg-gray-700 p-2 rounded-xl text-center text-white text-lg  md:text-3xl font-afacad  ' type="text" placeholder='Type Username..'  /> 

            <button onClick={handleSignUp} className='py-1 text-2xl md:text-4xl bg-black text-white w-[70%] mx-auto rounded-2xl '> Signup With Google  <i class=" md:text-2xl fa-brands fa-google "></i>  </button>

        </div>

    </div>
  )
}


export default Signup