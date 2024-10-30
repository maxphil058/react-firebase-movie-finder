import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, {  useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usersDbRef } from './firebase-config/firebase-config'
import { db } from './firebase-config/firebase-config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase-config/firebase-config'


function Movie() {

    const [movieDetails,setMovieDetails] = useState({})
    const [crewDetails,setCrewDetails] = useState({})
    const {paramID} = useParams()
    const [user] = useAuthState(auth);
    const [ isWatchListTrue,setIsWatchListTrue] = useState(false)
    const [ isFavoriteTrue,setIsFavoriteTrue] = useState(false);
    const [youtubeActive, setYoutubeActive] = useState(false)
    const [key,setKey] = useState("")


    useEffect(()=>{
        async function getTrailer(){
            let response = await fetch(`https://api.themoviedb.org/3/movie/${paramID}/videos?api_key=dcf64f9381584cecb483ff727dc95ff7`);

            let data = await response.json()
            // console.log(data)
            let info = data.results.find((doc,_)=>{ return doc.type === "Trailer" })
            
            setKey(info.key)
            // console.log(info)
        }
        getTrailer()
    },[])

    useEffect(()=>{

        async function getMovieDetails(){

            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${paramID}?api_key=dcf64f9381584cecb483ff727dc95ff7&append_to_response=videos,images`)

                const data = await response.json();
                setMovieDetails(data)    

            } catch (error) {
                console.log(error)
            }
            
            
        }
        getMovieDetails()

        async function getCrewDetails(){
            try {
                
                const response = await fetch(`https://api.themoviedb.org/3/movie/${paramID}/credits?api_key=dcf64f9381584cecb483ff727dc95ff7`)
    
                const data = await response.json();
                setCrewDetails(data) 

            } catch (error) {
                console.log(error)
            }
        }
        getCrewDetails()



    },[])

    
        let linkNos= movieDetails?.title?.split(" ");
        let newLink= linkNos?.join("-");

        const year = movieDetails?.release_date?.slice(0,4);

            




    async function addFavorite(){ 
        
        try {

            if(!user){
                return Swal.fire({
                icon: "error",
                title: "Login First!",
              
                confirmButtonColor: "black",
               }); }
            
            //    remove the color from true to not
               if(isFavoriteTrue){
                
                const docRef  = doc(db, "users" , user?.uid )
                await updateDoc ( docRef, {
                    favoritesMovie : arrayRemove(`${paramID}`)
                } )
               return  setIsFavoriteTrue(false)
               }

            //    make the color true 

            const docRef  = doc(db, "users" , user?.uid )
            await updateDoc ( docRef, {
                favoritesMovie : arrayUnion(`${paramID}`)
            } )


            
        } catch (error) {
            console.log(error)
        }

        checkFavAndList(paramID)
    }





    async function addList(){ 

        try {
            if(!user){
                return Swal.fire({
                icon: "error",
                title: "Login First!",
              
                confirmButtonColor: "black",
               }); }
            

               if(isWatchListTrue){
                
                const docRef  = doc(db, "users" , user?.uid )
                await updateDoc ( docRef, {
                    watchListMovie : arrayRemove(`${paramID}`)
                } )
               return  setIsWatchListTrue(false)
               }

            const docRef  = doc(db, "users" , user?.uid )
            await updateDoc ( docRef, {
                watchListMovie : arrayUnion(`${paramID}`)
            } )

            
        } catch (error) {
            console.log(error)
        }

        checkFavAndList(paramID)
    }


    function share(){ 
        try {

            if(navigator.share){
                navigator.share({
                    title: ` ${movieDetails?.title}`,
                    text:`Check out this movie!`,
                    url : window.location.href })    }
        } catch (error) {
            console.log(error)
        }
    }

    
    useEffect(()=>{
        
        checkFavAndList(paramID)
        
    },[user])
    
    async function checkFavAndList(id){
        try {
            const docRef  = doc(db, "users" , user?.uid )
        const data = await getDoc(docRef) ;
        let info = data.data()
        
        let isWatchList = info.watchListMovie.includes(id)
        let isFavorite = info.favoritesMovie.includes(id)

        isWatchList && setIsWatchListTrue(true)
        isFavorite && setIsFavoriteTrue(true)

        } catch (error) {
            console.log(error)
        }

    }

  return (
    <div className="movie-wrapper font-afacad bg-black ">
      {  
        
        movieDetails &&  <>
                <div className='relative w-full min-h-[15rem] max-h-[30rem]'>

                    <div className="poster-container absolute  h-[80%] top-[15%] left-[5%]  w-[30%] md:w-[25%]  ">
                <img className=" h-full w-full object-cover md:object-fill rounded-2xl " src={`https://image.tmdb.org/t/p/w200/${movieDetails.poster_path}`} alt="" />

            </div>

            <img className=" fade  h-full w-full min-h-[15rem] max-h-[30rem] " src={`https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`}  alt="" />

            </div>
            <aside className=' py-2 text-white text-center font-afacad text-4xl md:text-5xl '>
                {movieDetails?.title}
                <span className='font-afacad text-2xl md:text-4xl text-gray-700'> 
                    { (movieDetails && movieDetails?.release_date) &&  ` (${year})`  }
                    </span>
                </aside>

            <div className= ' p-1 font-afacad  text-center text-white text-xl md:text-3xl'>
                    { movieDetails && movieDetails?.genres?.map((doc,index)=>{ 
                        let total = movieDetails?.genres?.length-1
                        if( index===total){
                        return doc.name
                        } else{ return `${doc.name}, `}
                         })}
            </div>

            <div className=''>
                <p className='text-center text-white text-2xl  md:text-3xl border-2 border-gray w-[50%] mx-auto my-4 rounded-2xl' > <a href={`https://sflix.to/search/${newLink}`} className='font-afacad' target ="_blank"  > WATCH</a> </p>
            </div>
            
            <div className="md:text-2xl flex flex-row flex-wrap items-center justify-center gap-8 text-white py-4" >
                <div onClick={addList} className='flex flex-row  gap-2'>
                        <aside className={`md:w-10 md:h-10 rounded-[100%] h-8 grid place-items-center w-8 border-2 border-gray-800  ${isWatchListTrue && "bg-gray-800" } `}> <i class={`fa-solid fa-list ${isWatchListTrue && "text-red-700"}`}></i>  </aside>
                        <p>Add to list </p> 
                 </div>
                   
                <div onClick={addFavorite} className='flex flex-row  gap-2'>
                        <aside className={`md:w-10 md:h-10 rounded-[100%] h-8 grid place-items-center w-8 border-2 border-gray-800 ${isFavoriteTrue && "bg-gray-800"} `}> <i class={`fa-solid fa-heart ${isFavoriteTrue && "text-red-700"}`}></i> </aside>
                        <p>  Favorite</p>
                 </div>
                   
                <div onClick={share} className='flex flex-row  gap-2'>
                        <aside className='md:w-10 md:h-10 rounded-[100%] h-8 grid place-items-center w-8 border-2 border-gray-800 '><i class="fa-solid fa-share"></i></aside>
                        <p>Share</p>
                </div>
                    
            </div>

            <div onClick={()=>setYoutubeActive(!youtubeActive)} className='md:text-3xl flex flex-row items-center justify-center gap-4'> 
                <p className=' text-white'> Play trailer </p>
                <i class="fa-solid fa-caret-right text-white text-2xl"></i> 
            </div>
                {
                   youtubeActive && 
                <div className='relative'> <iframe className='w-full  min-h-[300px] md:h-[400px] ' src={`https://www.youtube.com/embed/${key}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>  

                <i onClick={()=>setYoutubeActive(false)} class=" absolute z-30 text-white text-4xl right-[0%] top-[5%] md:top-[2%] fa-solid fa-xmark"></i>

                </div>
                }




            <div className='py-4 px-4  text-white'>
                <h1 className='font-afacad text-4xl md:text-5xl text-white'>Overview</h1>
                <p className='font-afacad text-lg md:text-2xl text-white' >
                {movieDetails?.overview}
                </p>
                <h2 className='mt-4 font-bold text-xl  md:text-2xl text-white'>
                {    crewDetails?.crew?.length > 0? crewDetails.crew.filter((doc)=>(doc.job ==="Writer" || doc.job ==="Executive Producer") ).map((doc,index)=>{ 
                
                if((doc.job ==="Writer" || doc.job ==="Executive Producer")  && index=== 0){  return doc.name}
                if((doc.job ==="Writer" || doc.job ==="Executive Producer")){return ",  "+doc.name + "" }


                }):  "Not available yet" }
                </h2>
                <p className='mt-1 text-lg  md:text-2xl text-white'>Writer</p>
            </div>
             </>
        }

            <div className=''>

                <section className='bg-white overflow-x-scroll mb-8'>
        <p className=' text-black ml-8 p-2 text-3xl md:text-4xl'>Main Cast</p>

        <div className='overflow-x-scroll flex ml-4   flex-row gap-5'>

          {/* use poster path for the image src from the  url fetch */}
          {/* Series cast */}

          { crewDetails.cast && crewDetails.cast?.length > 0 ?  crewDetails.cast.map((doc,index)=>{ 
                if(!doc.profile_path){return null}
                return (
            <aside key ={index} className='flex flex-col item  gap- h-[290px] text-center w-[200px] flex-shrink-0    '>

             <div className='max-h-[200px] rounded-t-2xl  '>
                <img className='object-cover rounded-t-2xl h-full w-full ' src={doc.profile_path? `https://image.tmdb.org/t/p/w200${doc.profile_path}`:``} alt="pic" />
             </div>

            
            <div className='border-gray-500 border-b-2 border-x-2 rounded-b-2xl py-4 '>
                <p className='text-black font-bold text-lg'>{doc.name}</p>
                <p className='text-gray-700 text-wrap'> {doc?.character || "Not available  Yet" }</p>
            </div>

          </aside>
                )
            })
         :  <p className='text-black font-bold text-center'> Not available yet </p> }


          


        </div>

      </section>

            </div>
    </div>
  )
}

export default Movie