import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css'; // Import OpenLayers CSS
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj'; // Import fromLonLat for coordinate transformation
import { LineString } from 'ol/geom'; // Import LineString for drawing the route
import { Vector as VectorLayer } from 'ol/layer'; // Import for vector layers
import { Vector as VectorSource } from 'ol/source'; // Import for vector sources
import { Stroke, Style } from 'ol/style'; // For styling the route line

// Exporting the coordinates so they can be used in other components
export const sourceCoordinate = [77.6200, 12.9719]; // MG Road 
export const nearbyFriendCoordinates = [
  { coords: [77.6300, 12.9740], name: 'John Doe', detail: 'Friend 1 details' }, // Friend 1
  { coords: [77.6350, 12.9725], name: 'Jane Smith', detail: 'Friend 2 details' }, // Friend 2
  { coords: [77.6380, 12.9730], name: 'Mike Johnson', detail: 'Friend 3 details' }, // Friend 3
];
export const destinationCoordinate = [77.6836, 12.8391]; // Ensure this is accurate

const MapComponent = () => {
  const mapElement = useRef(null);
  const popupRef = useRef(null); // Reference for the popup overlay
  const [popupContent, setPopupContent] = useState(''); // State to manage the popup content
  const [routeLayer, setRouteLayer] = useState(null); // State to store the route layer

  // Refs for source, friends, and destination marker elements
  const sourceMarkerRef = useRef(null);
  const nearbyFriendMarkerRefs = useRef(nearbyFriendCoordinates.map(() => React.createRef()));
  const destinationMarkerRef = useRef(null); // Ensure this reference is properly attached

  // Function to fetch the route from OSRM
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
    // Initialize the map
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap source
        }),
      ],
      view: new View({
        center: fromLonLat(sourceCoordinate), // Center the map at the source
        zoom: 14, // Initial zoom level
      }),
    });

    // Create the popup overlay
    const popupOverlay = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [20, -20], // Position the popup slightly above the marker
    });
    map.addOverlay(popupOverlay);

    // Function to show popup
    const showPopup = (content, position) => {
      setPopupContent(content); // Set the popup content
      popupOverlay.setPosition(fromLonLat(position)); // Set popup position
      popupRef.current.style.display = 'block'; // Show the popup
    };

    // Function to hide popup
    const hidePopup = () => {
      popupRef.current.style.display = 'none'; // Hide the popup
    };

    // Add the source marker
    const sourceOverlay = new Overlay({
      position: fromLonLat(sourceCoordinate),
      positioning: 'center-center',
      element: sourceMarkerRef.current,
    });
    map.addOverlay(sourceOverlay);

    // Add nearby friend markers
    nearbyFriendCoordinates.forEach((friend, index) => {
      const overlay = new Overlay({
        position: fromLonLat(friend.coords),
        positioning: 'center-center',
        element: nearbyFriendMarkerRefs.current[index].current,
      });
      map.addOverlay(overlay);

      // Add hover event listener for each friend marker
      nearbyFriendMarkerRefs.current[index].current.addEventListener('mouseenter', () => {
        showPopup(`${friend.name}: ${friend.detail}`, friend.coords);
      });
      nearbyFriendMarkerRefs.current[index].current.addEventListener('mouseleave', hidePopup);
    });

    // Add the destination marker
    const destinationOverlay = new Overlay({
      position: fromLonLat(destinationCoordinate),
      positioning: 'center-center',
      element: destinationMarkerRef.current, // Ensure the element is correct
    });
    map.addOverlay(destinationOverlay);

    // Add hover event listener for the destination marker
    destinationMarkerRef.current.addEventListener('mouseenter', () => {
      showPopup('Destination: Electronic City', destinationCoordinate);
    });
    destinationMarkerRef.current.addEventListener('mouseleave', hidePopup);

    // Coordinates combinations to show different routes
    const routeCombinations = [
      [sourceCoordinate, nearbyFriendCoordinates[0].coords, destinationCoordinate],
      [sourceCoordinate, nearbyFriendCoordinates[1].coords, destinationCoordinate],
      [sourceCoordinate, nearbyFriendCoordinates[2].coords, destinationCoordinate],
    ];

    let currentRouteIndex = 0;

    const cycleRoutes = () => {
      // Clear the previous route layer if it exists
      if (routeLayer) {
        map.removeLayer(routeLayer);
      }

      // Fetch and display the next route
      const coordinates = routeCombinations[currentRouteIndex];

      getRoute(coordinates).then((route) => {
        if (route.length > 0) {
          const routeLine = new LineString(route); // Create the line geometry from route coordinates
          const newRouteLayer = new VectorLayer({
            source: new VectorSource({
              features: [routeLine], // Add the route line as a feature
            }),
            style: new Style({
              stroke: new Stroke({
                color: '#FF0000', // Red color for the route
                width: 3, // Line width
              }),
            }),
          });
          map.addLayer(newRouteLayer); // Add the route layer to the map
          setRouteLayer(newRouteLayer); // Update the state to store the current route layer
        }
      });

      // Update the route index to cycle through the routes
      currentRouteIndex = (currentRouteIndex + 1) % routeCombinations.length;
    };

    // Cycle routes every 3 seconds
    const interval = setInterval(cycleRoutes, 3000);

    // Cleanup the map and interval on component unmount
    return () => {
      clearInterval(interval); // Clear the interval
      map.setTarget(null);
    };
  }, [routeLayer]);

  return (
    <div>
      {/* The Map */}
      <div ref={mapElement} style={{ width: '100%', height: '400px' }} />

      {/* The popup overlay */}
      <div
        ref={popupRef}
        className="ol-popup"
        style={{
          display: 'none',
          position: 'absolute',
          backgroundColor: 'white',
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '12px', // Decreased font size
          zIndex: 1000,
        }}
      >
        {popupContent}
      </div>

      {/* The source marker element */}
      <div
        ref={sourceMarkerRef}
        style={{
          position: 'absolute',
          transform: 'rotate(0deg)',
        }}
      >
        🏠 {/* Home emoji as the source marker */}
      </div>

      {/* The nearby friend marker elements */}
      {nearbyFriendCoordinates.map((_, index) => (
        <div
          key={index}
          ref={nearbyFriendMarkerRefs.current[index]}
          style={{
            position: 'absolute',
            transform: 'rotate(0deg)',
            cursor: 'pointer',
          }}
        >
          👤 {/* Friend emoji as the nearby friend marker */}
        </div>
      ))}

      {/* The destination marker element */}
      <div
        ref={destinationMarkerRef}
        style={{
          position: 'absolute',
          transform: 'rotate(0deg)',
          cursor: 'pointer',
        }}
      >
        🎯 {/* Target emoji as the destination marker */}
      </div>
    </div>
  );
};

export default MapComponent;
