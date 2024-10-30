import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, usersDbRef } from './firebase-config/firebase-config'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { arrayRemove } from 'firebase/firestore'
import { NavLink } from 'react-router-dom'

function WatchListMovies() {

  const [user] = useAuthState(auth)
  const [info,setInfo]= useState({})
  const [movieIdArr,setMovieIdArr] = useState([]) 
  const [watchList,setWatchList]= useState([])

  const navigate = useNavigate()

  useEffect(() => {
    let unsuscribe;  // Declare 'unsuscribe' outside
  
    try {
      const docRef = doc(db, "users", user?.uid);
      
      unsuscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          let myInfo = (doc.data());
          setMovieIdArr(myInfo.watchListMovie);

        }
      });
    } catch (error) {
      console.error("Error setting up snapshot:", error);
    }
  
    // Cleanup function to unsubscribe from snapshot
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

        let obj = await Promise.all(movieIdArr.map(id => getMovieDetails(id)));

        setWatchList(obj);

      } catch (error) {
        console.log(error);
      }
    }
  
    fetchMovieDetails();
  }, [movieIdArr]);
  

  function goToMovie(id){

    navigate(`/movie/${id}`)

  }



  

async function remove (id){
  
  try {

    const docRef = doc(db, "users", user?.uid);

    await updateDoc ( docRef, {
                watchListMovie : arrayRemove(`${id}`)
            } )



  } catch (error) {
    console.log(error)
  }
}




  return (

    <div className="watch-list-movie-wrapper">
       {   

        watchList?  watchList.map((doc,index)=>{   
          return (

          <div className=' flex flex-col items-center pt-2'>
        <aside key={doc.id}
          onClick={()=>goToMovie(doc.id)} className="search-options rounded-lg border-2 border-gray flex flex-row gap-4 h-[150px] w-[95%] overflow-hidden "
        >
        <div className=' w-[10%] flex flex-col gap-4 items-center justify-center'> 
            <i class="fa-solid fa-list text-2xl text-black"></i>
            <i onClick ={()=>remove(doc.id)}  class="fa-solid fa-xmark text-3xl"></i>
        </div>

          <div className="max-h-[150px] w-[30%]">
            <img
              className="object-contain h-full w-full"
              src={`https://image.tmdb.org/t/p/w200/${doc.poster_path}`}
              alt=""
            />
          </div>

          <div className="flex flex-col gap-2 w-[70%] md:text-xl ">
            <div>
              <p className="text-black font-bold font-afacad">{doc.title}</p>
              <p className="text-gray-700 font-afacad">{doc.release_date}</p>
            </div>
            <div className="overflow-hidden">
              <p className="font-afacad text-black overflow-ellipsis overflow-hidden">
                {doc.overview}
              </p>
            </div>
          </div>
        </aside> 


        <div className=" hidden md:flex flex-row flex-wrap gap-8 text-gray-800 py-4" >
           
           
           <div onClick ={()=>remove(doc.id)} className='flex flex-row  gap-2'>
                <aside className=' rounded-[100%] h-8 grid place-items-center w-8 border-2 border-gray-800 '><i class="fa-solid fa-xmark"></i></aside>
                <p>Remove</p>
           </div>
            
        </div>
</div>

  )
})


: <>No item there </>


}
    </div>
  )
}

export default WatchListMovies