import React, { useContext, useState,useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from "leaflet";
import { TContext } from '../context';


const Mapa = () => {
  const { voziloInfo } = useContext(TContext)
  const [voziloInfoValue, setVoziloInfoValue] = voziloInfo

  const icon = new Icon({
    iconUrl: voziloInfoValue.ikonica,
    iconSize: [30, 27]
  });

  return <div>
    <MapContainer
      className="markercluster-map"
      center={[44.6703948975, 20.6011428833]}
      zoom={16}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {voziloInfoValue.ikonica?<Marker position={[voziloInfoValue.y, voziloInfoValue.x]} icon={icon}>
        <Popup>
          {voziloInfoValue.tablice}
        </Popup>
      </Marker>:null}
    </MapContainer>
  </div>
}
export default Mapa