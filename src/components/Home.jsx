import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'




function Home() {

  const [input, setInput] = useState("")
  const [trending, setTrending]= useState([])
  const [popular, setPopular]= useState([])
  const [upcoming, setUpcoming]= useState([])

  const navigate = useNavigate()

  useEffect(()=>{

  async function getPopularMovies() {
          
         let response = await  fetch("https://api.themoviedb.org/3/movie/popular?api_key=dcf64f9381584cecb483ff727dc95ff7&page=2")

         let data = await response.json() ;
         let movies = data.results
          setPopular(movies)
  }
  getPopularMovies()


  async function getTrendingMovies() {
          
    let response = await  fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=dcf64f9381584cecb483ff727dc95ff7")

    let data = await response.json() ;
    let movies = data.results
     setTrending(movies)
}
getTrendingMovies()

async function getUpcomingMovies() {
          
  let response = await  fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=dcf64f9381584cecb483ff727dc95ff7")

  let data = await response.json() ;
  let movies = data.results
   setUpcoming(movies)
}
getUpcomingMovies();

  }, [] )

  function  movieClick (id) {
    navigate(`/movie/${id}`)
    
  }

  function handleSearch() {
    if(input===""){ return}
    let wordArr= input.split(" ");
    if(wordArr.length===1){
      
      navigate(`/search/${wordArr}`)
    }else{
      let joinWordArr= wordArr.join("+")
      navigate(`/search/${joinWordArr}`) 
    }
  }

  return (
    <div className="home-wrapper bg-black">

      <section className=' bg-black  ' >
        <div className='input-container flex flex-col justify-center items-center gap-4 md:gap-5 text   p-6'>
            <div className='text-white'>
                <p className='font-bold text-5xl md:text-6xl'>Welcome</p>
                <p className='text-2xl md:text-4xl'>Find information on millions of movies</p>
            </div>

            <div className='flex flex-row   min-w-[70%]  bg-white rounded-2xl '>
              <input  className="text-black p-2 flex-[60%] rounded-l-2xl md:text-3xl" type="text" value={input}  onChange={e=>setInput(e.target.value)}  placeholder='search...' />
              <button className='rounded-2xl px-2 flex-[10%] text-white bg-gray-700 md:text-3xl' onClick={handleSearch}> Search</button>
            </div>

        </div>
      </section>

      {/* TRENDING SECTION */}

      <section className='bg-white overflow-x-scroll mb-8'>
        <p className=' text-black ml-8 p-2 text-4xl md:text-5xl'> Trending</p>

        <div className='overflow-x-scroll flex ml-4   flex-row gap-5'>

          {
            trending.map((movie,index)=>{return (
              
          <aside key={index} on className='flex flex-col  gap-1 text-center h-[400px] w-[200px] flex-shrink-0  '  onClick={()=>movieClick(movie.id)}>

                <div className=' h-[300px] '>
                <img className='object-cover  h-full w-full ' src={movie.poster_path? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : "https://placehold.co/200x200?text=N/A"} alt="pic" />
                </div>

            <p className='text-black font-bold text-lg text-wrap overflow-x-scrollauto md:text-2xl'>{movie.title}</p>
            <p className='text-gray-700 md:text-xl'>{movie.release_date}</p>


          </aside>  
          ) } )}

        </div>

      </section>

      {/* POPULAR SECTION */}
      <section className='bg-black overflow-x-scroll'>
        <p className=' text-white ml-8 p-2 text-4xl md:text-5xl'> WHAT'S POPULAR?</p>

        <div className='overflow-x-scroll flex ml-4   flex-row gap-5'>

          {
            popular.map((movie,index)=>{return (
              
          <aside key={index} className='flex flex-col  gap-1 text-center h-[400px] w-[200px] flex-shrink-0   '  onClick={()=>movieClick(movie.id)}>

                <div className=' h-[300px]'>
                <img className='object-cover  h-full w-full ' src={movie.poster_path? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : "https://placehold.co/200x200?text=N/A"}  alt="pic" />
                </div>

            <p className='text-white font-bold text-lg md:text-2xl '>{movie.title}</p>
            <p className='text-gray-400 md:text-xl'>{movie.release_date}</p>
          </aside>  
          ) } )}
        </div>

      </section>

      {/* UPCOMING */}
      <section className='bg-white overflow-x-scroll mb-8'>
        <p className=' text-black ml-8 p-2 text-4xl md:text-5xl'> TOP RATED!</p>

        <div className='overflow-x-scroll flex ml-4   flex-row gap-5'>

          {
            upcoming.map((movie,index)=>{return (
              
          <aside key={index} className='flex flex-col  gap-1 text-center h-[400px] w-[200px] flex-shrink-0   '  onClick={()=>movieClick(movie.id)}>
                <div className=' h-[300px] '>
                <img className='object-cover  h-full w-full ' src={movie.poster_path? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : "https://placehold.co/200x200?text=N/A"}  alt="pic" />
                </div>
            <p className='text-black font-bold text-lg text-wrap overflow-x-scrollauto md:text-2xl'>{movie.title}</p>
            <p className='text-gray-700 md:text-xl'>{movie.release_date}</p>


          </aside>  
          ) } )}

        </div>

      </section>

    </div>
  )
}

export default Home