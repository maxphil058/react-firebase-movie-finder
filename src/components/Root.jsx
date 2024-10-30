import React from 'react'
import { Outlet } from 'react-router-dom'
// import Logo from "../Assets/phil-logo.png"
import { useState,useEffect } from 'react'
import { useNavigate,NavLink } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "./firebase-config/firebase-config.js"
import {signOut}  from 'firebase/auth'




function Root() {



  const [searchActive,setSearchActive] =useState(false)
  const [input, setInput] = useState("")
  const [loginActivePopup,setLoginActivePopup]= useState(false)
  const [profileActivePopup,setProfileActivePopup]= useState(false);
  const navigate = useNavigate()
  const [user,loading] = useAuthState(auth)  
// console.log(user.photoURL)



  function  returnToHome(){
    navigate("/")
  }


  function handleSearch(){

    if(input===""){ return}
    let wordArr= input.split(" ");
    if(wordArr.length===1){
      
      navigate(`/search/${wordArr}`)
    }else{
      let joinWordArr= wordArr.join("+")
      navigate(`/search/${joinWordArr}`) 
    }

    setSearchActive(!searchActive)
    setInput("")
  }

  function handleLoginActive (){ 
    setSearchActive(false)
    if(user){ return setProfileActivePopup(!profileActivePopup) }

    setLoginActivePopup(!loginActivePopup)
  }



  async function handleLogout(){
    await signOut(auth)
    navigate("/")
    
    setProfileActivePopup(false);
    setLoginActivePopup(false);
  }


  function  handleSearchActive() {

    setProfileActivePopup(false);
    setLoginActivePopup(false);
    setSearchActive(!searchActive)
  }
  return (
    <div className='relative'> 
        <div className='header-wrapper border-b-2 border-gray-500 flex justify-between items-center bg-black min-h-12 text-white'>
       
        <div onClick={returnToHome} className='min-h-12 p-2 flex items-center justify-center  '>
            {/* <img  className='h-auto object-fill' src={Logo} alt="" /> */}
              <p className='text-2xl md:text-4xl'> PHIL MOVIE BOX</p>

        </div>
        

        <div className=' pr-2 flex gap-12 text-2xl md:text-5xl items-center'>
            <i onClick={handleSearchActive} class="fa-solid fa-magnifying-glass"></i>

            <div className=' relative'>

            {user? <img onClick={handleLoginActive} src={user?.photoURL} className="rounded-[100%] h-[2.5rem] w-[2.5rem] md:w-[3.0rem] md:h-[3.0rem]  " alt="" /> :<i onClick={handleLoginActive} class="fa-regular fa-user"></i> }


             {(loginActivePopup && !user) && <div className=' rounded-2xl z-20 absolute min-w-[8rem] md:min-w-[10rem] right-[10%] px-5 py-2 bg-white text-black  text-lg md:text-2xl flex flex-col'>
                
                <NavLink to="/" className='text-nowrap border-b-2 border-black '>Go to Home</NavLink>
                <NavLink to="/login" className='text-nowrap border-b-2 border-black '>Login</NavLink>
                <NavLink to="/signup" className='text-nowrap'> Sign Up</NavLink>

            </div> 
            }

             {profileActivePopup && <div className=' rounded-2xl absolute z-20  min-w-[8rem] md:min-w-[10rem] right-[10%] md:top-[120%] px-5 py-2 bg-white text-black  text-lg md:text-2xl flex flex-col'>
                
                <NavLink to="/" className='text-nowrap border-b-2 border-black '>Go to Home</NavLink>
                <NavLink to={ user?`/profile/${user.uid}` : `/`} className='text-nowrap border-b-2 border-black '>Go to Profile</NavLink>
                <button onClick={handleLogout}  className='text-nowrap'>Logout</button>

            </div> 
            } 

            </div>
        </div>

        </div>
       { searchActive && <div className='border-b-2 border-gray-700 relative'> 
            <input type="text" placeholder='Search..'  value={input} onChange={e=>setInput(e.target.value)} className='min-h-20 pl-4 font-afacad text-2xl md:text-3xl   bg-gray-700 w-full text-white '/>

            <button onClick={handleSearch} className='absolute inline-block bg-white z-10 text-black text-2xl md:text-3xl h-full right-0 w-[20%] '>Search</button>
        </div>  }
        <Outlet/>

        <div className="copy-wrapper  flex flex-col justify-center items-center gap-4 text-white bg-black text-sm md:text-lg p-6 " >
           <p className='font-afacad'> 
             Phil Movie Box is a Free Movies site with zero ads. We let you find movies online without having to register or paying, with over 10000 movies and TV-Series. You can also watch movies but you will be redirected to a partnering site for that. 
          </p>
           <p className='text-lg md:text-2xl '>
              © PHIL
           </p>
        </div>
    </div>
  )
}

export default Root