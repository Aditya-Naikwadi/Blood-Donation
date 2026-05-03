import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

const MapWithClustering = ({ donors }: { donors: any[] }) => {
  return (
    <MapContainer center={[19.076, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
      >
        {donors.map(donor => (
          <Marker key={donor.id} position={[donor.lat, donor.lng]}>
            <Popup>
              <div className="text-black">
                <p className="font-bold">{donor.name}</p>
                <p>Blood Type: {donor.bloodType}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapWithClustering;
