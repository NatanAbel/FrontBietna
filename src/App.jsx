import Navbar from './component/Navbar'
import './App.css'
import LandingPage from './pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Footer from './component/Footer'
import HouseList from './pages/houseList'

function App() {

  return (
    <> 
      <Navbar/>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/houses" >
          <Route path='rent' element={<HouseList/>} />
          <Route path='buy' element={<HouseList/>}   />
        </Route>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
