import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Home from './components/Home'
import Counter from './components/Counter'
import { Grid } from '@mui/material'
import MapComponent from './components/MapComponent'


function App() {
  // the default screensize provided by mui
  const SCREEN_SIZE = 12
  const MAP_SIZE = 8
  const MENU_SIZE = SCREEN_SIZE - MAP_SIZE

  // return <div>
  //   {MapComponent()}
  // </div>
  return ( <Grid container>
    <Grid item xs={MENU_SIZE}>
      <Home />
      <Counter />
    </Grid>
    <Grid item xs={MAP_SIZE}>
      <MapComponent />
    </Grid>
    {/* <Grid item xs={SCREEN_SIZE}>
      <MapComponent />
    </Grid> */}
  </Grid>
  )
}

export default App

