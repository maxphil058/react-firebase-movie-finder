import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, usersDbRef } from './firebase-config/firebase-config'
import { arrayRemove, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'




function Favorites() {


  const [user] = useAuthState(auth)
  const [info,setInfo]= useState({})
  const [movieIdArr,setMovieIdArr] = useState([]) 
  const [favorite,setFavorite]= useState([])

  const navigate = useNavigate()



  useEffect(() => {
    let unsuscribe; 
    
    try {   
      
      const docRef = doc(db, "users", user?.uid);

      unsuscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {

          console.log(doc.data())
          let myInfo = (doc.data());
          setMovieIdArr(myInfo.favorites);
        }
      });
    } catch (error) {
      console.log(error);
    }
  
    return () => {
      if (unsuscribe) {
        unsuscribe();  // Ensure it's defined before calling
      }
    };
  }, [user]);


  
  useEffect(() => {

    async function fetchMovieDetails() {
      try {
        async function getMovieDetails(id) {
          let response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=dcf64f9381584cecb483ff727dc95ff7`);
          let data = await response.json();
          return data;
        }
        
        console.log("first");
        console.log(movieIdArr)
        let obj = await Promise.all(movieIdArr.map(id => getMovieDetails(id)));
        console.log(obj)
        setFavorite(obj);


      } catch (error) {
        console.log(error);
      }
    };
  
  fetchMovieDetails();
  }, [movieIdArr]);
  
   
  function goToMovie(id){

    navigate(`/movie/${id}`)

  }

  async function remove (id){
  
    try {
  
      const docRef = doc(db, "users", user?.uid);
  
      await updateDoc ( docRef, {
                  favorites : arrayRemove(`${id}`)
              } )
  
  
  
    } catch (error) {
      console.log(error)
    }

  }
  

  return (
    <div className='text-black favorite-wrapper'>
         <div className='flex flex-row gap-8 justify-around md:text-xl'>
        <p className='font-bold text-black font-afacad  text-lg  md:text-2xl' >My Favorites</p>

        <div className='flex flex-row gap-8'>
            <NavLink to="movies" className={ ({isActive})=>  `text-black font-afacad ${ isActive && 'border-b-4 border-black ' }`}>MOVIES</NavLink>
            <NavLink to="tv" className={ ({isActive})=>  `text-black font-afacad ${ isActive && 'border-b-4 border-black ' }`} >TV</NavLink>
        </div>
    </div>


   

        <div className='all-favorite-wrapper' >

        <Outlet />

      </div>
    </div>
  )
}

export default Favorites