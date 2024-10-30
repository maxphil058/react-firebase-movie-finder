
import React from 'react'
import { RouterProvider,createBrowserRouter,Navigate,createRoutesFromElements,Route } from 'react-router-dom'
import Root from './components/Root'
import Home from './components/Home'
import Movie from './components/Movie'
import Search from './components/Search'
import Profile from './components/Profile'
import Overview from './components/Overview'
import WatchList from './components/WatchList'
import Favorites from './components/Favorites'
import Login from './components/Login'
import Signup from './components/Signup'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './components/firebase-config/firebase-config'
import Loading from './components/Loading'
import ProfileSettings from './components/ProfileSettings'
import TV from './components/TV'
import FavoritesTv from './components/FavoritesTv'
import FavoritesMovies from './components/FavoritesMovies'
import WatchListMovies from './components/WatchListMovies'
import WatchListTv from './components/WatchListTv'



function App() {

  const [user,loading] = useAuthState(auth)

  const router = createBrowserRouter( createRoutesFromElements (
    <Route path='/' element={<Root />} >  
      <Route index element={ <Navigate to="home"/>}/>
      
      <Route path='home' element={<Home/>}/>
      
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/>

      <Route path='search/:query' element={<Search/>}/>

      <Route path='movie/:paramID' element={<Movie/>}/>
      <Route path='tv-show/:paramID' element={<TV/>}/>
      
      <Route path='profile/:uid' element={loading?<Loading/>:user?<Profile/> : <Navigate to="/login"/> }>
        
        <Route index element={ <Navigate to="watch-list"/>}/>

        <Route path="watch-list"  element={<WatchList/>} >

          <Route index element={ <Navigate to="movies"/>}/>
          <Route path="movies"  element={<WatchListMovies/>} />
          <Route path="tv"  element={<WatchListTv/>} />
        
        </Route>

        <Route path="favorites"  element={<Favorites/>} >

        <Route index element={ <Navigate to="movies"/>} />
        <Route path="movies"  element={<FavoritesMovies/>} />
        <Route path="tv"  element={<FavoritesTv/>} />

        </Route>

        <Route path="account"  element={<Overview/>} >

          <Route index element={<Navigate to="profile-settings" />} />
          
          <Route path='profile-settings' element={<ProfileSettings/>}  />

        </Route>

      </Route>
    </Route>
  ))
  return (
    <RouterProvider router={router} />
  )
}

export default App