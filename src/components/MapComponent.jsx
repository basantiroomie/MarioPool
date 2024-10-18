import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css'; // Import OpenLayers CSS
import '../index.css'; // Import the global CSS that now contains styles for the map

import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { LineString } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';

export const sourceCoordinate = [77.6200, 12.9719];
export const nearbyFriendCoordinates = [
  { coords: [77.6300, 12.9740], name: 'Friend 1', age: '23', gender: 'female' },
  { coords: [77.6350, 12.9725], name: 'Friend 2', age: '25', gender: 'female' },
  { coords: [77.6380, 12.9730], name: 'Friend 3', age: '20', gender: 'male' },
];
export const destinationCoordinate = [77.6836, 12.8391];

const MapComponent = () => {
  const mapElement = useRef(null);
  const popupRef = useRef(null);
  const [popupContent, setPopupContent] = useState('');
  const [routeLayer, setRouteLayer] = useState(null);

  const sourceMarkerRef = useRef(null);
  const nearbyFriendMarkerRefs = useRef(nearbyFriendCoordinates.map(() => React.createRef()));
  const destinationMarkerRef = useRef(null);

  const getRoute = async (coordinates) => {
    const coordsString = coordinates.map(coord => coord.join(',')).join(';');
    const osrmApiUrl = `http://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(osrmApiUrl);
      const data = await response.json();
      if (data && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates.map(coord => fromLonLat(coord));
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
    return [];
  };

  useEffect(() => {
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(sourceCoordinate),
        zoom: 14,
      }),
    });

    const popupOverlay = new Overlay({
      element: popupRef.current,
      positioning: 'top-center',
      stopEvent: false,
      offset: [20, -20],
    });
    map.addOverlay(popupOverlay);

    const showPopup = (friend, position) => {
      const content = `
        <strong>${friend.name}</strong><br />
        <strong>Age:</strong> ${friend.age}<br />
        <strong>Gender:</strong> ${friend.gender}`;
      setPopupContent(content);
      popupOverlay.setPosition(fromLonLat(position));
      popupRef.current.style.display = 'block';
    };

    const hidePopup = () => {
      popupRef.current.style.display = 'none';
    };

    const sourceOverlay = new Overlay({
      position: fromLonLat(sourceCoordinate),
      positioning: 'center-center',
      element: sourceMarkerRef.current,
    });
    map.addOverlay(sourceOverlay);

    nearbyFriendCoordinates.forEach((friend, index) => {
      const overlay = new Overlay({
        position: fromLonLat(friend.coords),
        positioning: 'center-center',
        element: nearbyFriendMarkerRefs.current[index].current,
      });
      map.addOverlay(overlay);

      nearbyFriendMarkerRefs.current[index].current.addEventListener('mouseenter', () => {
        showPopup(friend, friend.coords);
      });
      nearbyFriendMarkerRefs.current[index].current.addEventListener('mouseleave', hidePopup);
    });

    const destinationOverlay = new Overlay({
      position: fromLonLat(destinationCoordinate),
      positioning: 'center-center',
      element: destinationMarkerRef.current,
    });
    map.addOverlay(destinationOverlay);

    destinationMarkerRef.current.addEventListener('mouseenter', () => {
      showPopup({ name: 'Destination', age: 'N/A', gender: 'N/A' }, destinationCoordinate);
    });
    destinationMarkerRef.current.addEventListener('mouseleave', hidePopup);

    const routeCombinations = [
      [sourceCoordinate, nearbyFriendCoordinates[0].coords, destinationCoordinate],
      [sourceCoordinate, nearbyFriendCoordinates[1].coords, destinationCoordinate],
      [sourceCoordinate, nearbyFriendCoordinates[2].coords, destinationCoordinate],
    ];

    let currentRouteIndex = 0;

    const cycleRoutes = () => {
      if (routeLayer) {
        map.removeLayer(routeLayer);
      }

      const coordinates = routeCombinations[currentRouteIndex];

      getRoute(coordinates).then((route) => {
        if (route.length > 0) {
          const routeLine = new LineString(route);
          const newRouteLayer = new VectorLayer({
            source: new VectorSource({
              features: [routeLine],
            }),
            style: new Style({
              stroke: new Stroke({
                color: '#FF0000',
                width: 3,
              }),
            }),
          });
          map.addLayer(newRouteLayer);
          setRouteLayer(newRouteLayer);
        }
      });

      currentRouteIndex = (currentRouteIndex + 1) % routeCombinations.length;
    };

    const interval = setInterval(cycleRoutes, 3000);

    return () => {
      clearInterval(interval);
      map.setTarget(null);
    };
  }, [routeLayer]);

  return (
    <div className="map-component">
      <div ref={mapElement} className="map-container" />
      <div ref={popupRef} className="ol-popup">
        <div dangerouslySetInnerHTML={{ __html: popupContent }} />
      </div>

      <div ref={sourceMarkerRef} className="marker source-marker">
        🏠
      </div>

      {nearbyFriendCoordinates.map((_, index) => (
        <div
          key={index}
          ref={nearbyFriendMarkerRefs.current[index]}
          className="marker friend-marker"
        >
          👤
        </div>
      ))}

      <div ref={destinationMarkerRef} className="marker destination-marker">
        🎯
      </div>
    </div>
  );
};

export default MapComponent;
