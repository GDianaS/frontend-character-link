import { useState, useEffect } from 'react'
import './styles/global.css'
import axios from "axios"
import Sidebar from './components/Sidebar'
import Layout from './scenes/layout'
import { Routes, Route, Navigate } from "react-router-dom";
import Works from './scenes/works'
import Charts from './scenes/charts'
import WorkDetail from './scenes/workDetail'

function App() {
  // const [array, setArray] = useState([])

  // const fetchAPI = async () =>{
  //   const response = await axios.get("http://localhost:8080/api");
  //   setArray(response.data.fruits);
  //   console.log(response.data.fruits);
  // };

  // useEffect(()=>{
  //   fetchAPI();
  // }, [])

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Navigate to="/works" replace />} />
          <Route path="/works" element={<Works/>} />
          <Route path="/works/:id" element={<WorkDetail/>}/>
          <Route path="/charts" element={<Charts/>} />

        </Route>
      </Routes>
    </div>
  )
}

export default App
