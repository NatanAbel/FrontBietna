import Navbar from './component/Navbar'
import './App.css'
import LandingPage from './pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Footer from './component/Footer'
import HouseList from './pages/houseList'
import DetailsPage from './pages/detailsPage'
import UpdatePage from './pages/updatePage'
import NewHousePage from './pages/NewHousePage'

function App() {

  return (
    <> 
      <Navbar/>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/houses">
          <Route path='allHouses' element={<HouseList/>} />
          <Route path='rent' element={<HouseList/>} />
          <Route path='buy' element={<HouseList/>}   />
        </Route>
        <Route path='/housesDetails/:houseId' element={<DetailsPage/>}/>
        <Route path='/update/:houseId' element={<UpdatePage/>}/>
        <Route path='/house/new' element={<NewHousePage/>}/>


      </Routes>
      <Footer/>
    </>
  )
}

export default App
