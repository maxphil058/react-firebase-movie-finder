import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Search() {
  const navigate = useNavigate();
  const { query } = useParams();

  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSearch() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=dcf64f9381584cecb483ff727dc95ff7`
        );
        const data = await response.json();
        console.log(data.results);
        setSearchData(data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
         // handle error by stopping the loading state
      }
    }
    getSearch();
  }, [query]); // Added query as dependency to fetch on query change


  function handleSearch(id ,type){

    if( type === "movie"){ navigate(`/movie/${id}`)}
    if( type === "tv"){ navigate(`/tv-show/${id}`)}

  }
  return (
    <>
      {loading ? (
        <div className='flex flex-col justify-center items-center' >
          <p className='text-[5rem] text-black'>Loading...</p>
          <i className=" text-[8rem] text-black fa-solid fa-circle-notch fa-spin"></i> {/* className instead of class */}
        </div>
      ) : (
        <div className="search-wrapper text-black">
          <section className="search-results items-center justify-center flex flex-col gap-4 p-1">
            {searchData.length > 0 ? (
              searchData.filter((doc)=>{return doc.media_type !=="person" }).map((doc, index) => (
                <aside 
                  key={doc.id}
                  onClick={()=>handleSearch(doc.id ,doc.media_type )}
                  className="search-options rounded-lg border-2 border-gray flex flex-row gap-4 h-[150px] w-[90%] overflow-hidden"
                >
                  <div className="max-h-[150px] w-[30%]">
                    <img
                      className="object-cover h-full w-full"
                      src={ doc?.poster_path? `https://image.tmdb.org/t/p/w200${doc.poster_path}` : "https://placehold.co/200x200?text=N/A"}
                      alt={doc.title}
                    />
                  </div>

                  <div className="flex flex-col text-lg md:text-xl gap-2 w-[70%]">
                    <div>
                      <p className="text-black font-bold font-afacad">{doc.title || doc.name}</p>
                      <p className="text-gray-700 font-afacad">{doc.release_date|| doc.first_air_date
 || `N/A` }</p>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-afacad text-black overflow-ellipsis overflow-hidden">
                        {doc.overview}
                      </p>
                    </div>
                  </div>
                </aside>
              ))
            ) : (
              <p>No results found</p>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default Search;
