import React, { useContext, useState, useEffect, useRef } from "react";
import { Map, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from "leaflet";
import { TContext } from '../context';


const Mapa = () => {
  const mapRef = useRef()
  const { voziloInfo } = useContext(TContext)
  const [voziloInfoValue, setVoziloInfoValue] = voziloInfo

  const icon = L.icon({
    iconUrl: voziloInfoValue.ikonica,
    iconSize: [30, 27]
  });

  const Zoom = () => {
    const map = mapRef.current;
    var group = new L.featureGroup([L.marker([voziloInfoValue.y, voziloInfoValue.x])]);
    if (map) map.leafletElement.fitBounds(group.getBounds());
  }

  useEffect(() => {
    Zoom()
  }, [voziloInfoValue.x])

  return <div>
    <Map
      ref={mapRef}
      className="markercluster-map"
      // center={[44.7922353597, 20.4862294847]}
      zoom={16}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {voziloInfoValue.ikonica ? <Marker position={[voziloInfoValue.y, voziloInfoValue.x]} icon={icon}>
        <Popup>
          {voziloInfoValue.tablice}
        </Popup>
      </Marker> : null}
    </Map>
  </div>
}
export default Mapa