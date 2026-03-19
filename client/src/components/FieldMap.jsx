import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Draw Control
const DrawControl = ({ onCreated, onEdited }) => {
  const map = useMapEvents({
    draw: useCallback((e) => {
      const layer = e.layer;
      map.addLayer(layer);
      onCreated(layer.toGeoJSON());
    }, []),
    drawstart: useCallback(() => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) map.removeLayer(layer);
      });
    }, []),
  });

  useEffect(() => {
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: true,
        circle: false,
        marker: false,
        rectangle: false,
        polyline: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
      },
    });
    map.addControl(drawControl);

    return () => map.removeControl(drawControl);
  }, [map]);

  return null;
};

const FieldMap = ({ field, onFieldChange }) => {
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default Delhi
  const [coordinates, setCoordinates] = useState([]);
  const [area, setArea] = useState(0);
  const [locationName, setLocationName] = useState('');
  const { token } = useAuth();
  const { post, get } = useApi('/fields');

  useEffect(() => {
    if (field) {
      setCoordinates(field.coordinates);
      setArea(field.area);
      setLocationName(field.locationName);
      if (field.center) setPosition([field.center.lat, field.center.lng]);
    }
  }, [field]);

  const handlePolygonCreated = (geoJson) => {
    const coords = geoJson.geometry.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
    setCoordinates(coords);

    // Approximate area using shoelace formula (sq meters)
    const a = coords.map(p => [p.lng, p.lat]);
    const areaSqKm = Math.abs(a.reduce((sum, p1, i) => 
      sum + (a[i+1 ? i+1 : 0][0] - p1[0]) * (a[i+1 ? i+1 : 0][1] + p1[1]), 0)) / 2;
    const areaSqM = areaSqKm * 1000000;
    setArea(Math.round(areaSqM));

    onFieldChange({ coordinates: coords, area: areaSqM, center: {
      lat: coords.reduce((sum, p) => sum + p.lat, 0) / coords.length,
      lng: coords.reduce((sum, p) => sum + p.lng, 0) / coords.length,
    } });
  };

  const saveField = async () => {
    if (coordinates.length === 0) return;
    const data = { coordinates, area, locationName, isDefault: true };
    await post(data, { Authorization: `Bearer ${token}` });
  };

  const loadFields = async () => {
    const fields = await get('', { Authorization: `Bearer ${token}` });
    return fields;
  };

  return (
    <div className="h-96 w-full rounded-lg shadow-lg relative">
      <div className="absolute top-2 left-2 z-[1000] bg-white p-2 rounded shadow-md space-y-2">
        <input
          type="text"
          placeholder="Location name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="w-48 p-1 border rounded text-sm"
        />
        <button
          onClick={saveField}
          className="w-full bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
        >
          Save Field
        </button>
        <button
          onClick={loadFields}
          className="w-full bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
        >
          Load Fields
        </button>
        <div className="text-xs">
          Area: {area.toLocaleString()} m²
        </div>
      </div>
      <MapContainer center={position} zoom={15} className="h-full w-full rounded-lg">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.length > 0 && (
          <Polygon positions={coordinates.map(c => [c.lat, c.lng])} color="blue" />
        )}
        <DrawControl onCreated={handlePolygonCreated} />
      </MapContainer>
    </div>
  );
};

export default FieldMap;

