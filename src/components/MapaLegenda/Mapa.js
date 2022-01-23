// import React,{useContext, useState} from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import { Icon } from "leaflet";
// import {TContext} from '../context';
// import 'leaflet/dist/leaflet.css';


// const Mapa=()=>{
//     const{lokacija, ikonica}=useContext(TContext)
//     const [lokacijaValue,setLokacijaValue]=lokacija
//     const [ikonicaValue, setIkonicaValue]=ikonica

//     const icon = new Icon({
//             iconUrl: ikonicaValue,
//             iconSize: [25, 25]
//           });

//     function LocationMarker() {
//         const [position, setPosition] = useState(null)
//         const map = useMapEvents({
//             click() {
//                 map.locate()
//               },
//           locationfound() {
//             setPosition({lat:lokacijaValue.y,lng:lokacijaValue.x})
//             map.flyTo({lat:lokacijaValue.y,lng:lokacijaValue.x}, map.getZoom())
//           },
//         })
      
//         return position === null ? null : (
//           <Marker position={position}  icon={icon}>
//             {/* <Popup>You are here</Popup> */}
//           </Marker>
//         )
//       }

//     return <div>
//         <MapContainer
//                 className="markercluster-map"
//                 center={[44.6703948975,20.6011428833 ]}
//                 zoom={16}
//                 maxZoom={18}
//             >
//                 <TileLayer style={{background:'red'}}
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                         {/* <Marker 
//           position={[
//             lokacijaValue.y,
//             lokacijaValue.x
//           ]}
//            icon={icon}
//         /> */}
//             <LocationMarker />
//             </MapContainer> 
//     </div>
// }
// export default Mapa
import React,{useContext} from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
 import {TContext} from '../context';

const containerStyle = {
  width: '100%', height: '44.5vh', position: 'relative'
};



function MyComponent() {

  const{lokacija}=useContext(TContext)
  const[lokacijaValue,setLokacijaValue]=lokacija;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBiGr3fvCYiNurq-G5UCPAsYsPcQAHMGOo"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  const center = {
    lat: lokacijaValue.y,
    lng: lokacijaValue.x
  };
  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={20}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
            <Marker 
            position={{
              lat: lokacijaValue.y,
              lng: lokacijaValue.x
            }} />
            <></>
      </GoogleMap>
  ) : <>
  </>
}

export default React.memo(MyComponent)