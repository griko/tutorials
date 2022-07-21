import { MapContainer, TileLayer, useMap } from 'react-leaflet'

function MapComponent(){
    return <div id="map"><MapContainer style={{height: '100%'}} center={[32.0, 37.0]}  zoom={7} scrollWheelZoom={false}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </MapContainer>
  </div>
}

export default MapComponent;