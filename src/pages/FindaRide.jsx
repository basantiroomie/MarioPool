import React, { useState } from 'react';
import MapComponent, { nearbyFriendCoordinates, destinationCoordinate, sourceCoordinate } from '../components/MapComponent';
import axios from 'axios';

const FindaRide = () => {
  // Transform nearbyFriendCoordinates into objects with lat/lon, age, and gender for display purposes
  const nearbyFriends = nearbyFriendCoordinates.map((friend, index) => ({
    name: `Friend ${index + 1}`,
    lat: friend.coords[1],
    lon: friend.coords[0],
    age: friend.age,
    gender: friend.gender,
  }));

  // State for the selected friend
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  // State for distance and time
  const [distanceAndTime, setDistanceAndTime] = useState({ distance: '', duration: '' });

  // Handle friend selection from the dropdown
  const handleSelectFriend = async (event) => {
    const friendIndex = event.target.value;
    const selected = nearbyFriends[friendIndex];
    setSelectedFriend(selected);

    // Call the OpenRouteService API to calculate the distance and time
    const apiKey = '5b3ce3597851110001cf62487d542030a704431d85b7fbae397b9a89';
    const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${sourceCoordinate[0]},${sourceCoordinate[1]}&end=${selected.lon},${selected.lat}`;
    
    try {
      const response = await axios.get(orsUrl);
      console.log('API Response:', response.data);
      const data = response.data.routes[0].summary;

      // Update state with distance and duration
      setDistanceAndTime({
        distance: (data.distance / 1000).toFixed(2) + ' km',
        duration: (data.duration / 60).toFixed(2) + ' min',
      });
    } catch (error) {
      console.error('Error fetching route data:', error);
      setDistanceAndTime({
        distance: 'N/A',
        duration: 'N/A',
      });
    }
  };

  // Handle "Call" button click
  const handleCall = () => {
    if (selectedFriend) {
      alert(`Calling ${selectedFriend.name}...`);
    }
  };

  // Handle "Open in Google Maps" button
  const handleViewInMaps = () => {
    if (selectedFriend) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${sourceCoordinate[1]},${sourceCoordinate[0]}&destination=${destinationCoordinate[1]},${destinationCoordinate[0]}&waypoints=${selectedFriend.lat},${selectedFriend.lon}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header>
        <h1>Find A Ride</h1>
        <p>Find your friends and start carpooling together!</p>
      </header>

      {/* Map */}
      <MapComponent
        sourceCoordinate={sourceCoordinate}
        nearbyFriendCoordinates={nearbyFriendCoordinates}
        destinationCoordinate={destinationCoordinate}
      />

      {/* Nearby Friends Details */}
      <div style={{ marginTop: '20px' }}>
        <h3>Nearby Friends Details</h3>
        <table>
          <thead>
            <tr>
              <th>Friend</th>
              <th>Age</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {nearbyFriends.map((friend, index) => (
              <tr key={index}>
                <td>{friend.name}</td>
                <td>{friend.age}</td>
                <td>{friend.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Friend selection */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="selectFriend">Select a nearby friend for actions:</label>
        <select id="selectFriend" onChange={handleSelectFriend} defaultValue="">
          <option value="" disabled>Select a friend</option>
          {nearbyFriends.map((friend, index) => (
            <option key={index} value={index}>
              {friend.name}
            </option>
          ))}
        </select>
      </div>

      {/* Call, View in Maps buttons, and distance/time display */}
      {selectedFriend && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleCall}>Call {selectedFriend.name}</button>
          <button onClick={handleViewInMaps} style={{ marginLeft: '10px' }}>Open in Google Maps</button>
          <div style={{ marginTop: '10px' }}>
            <h4>Distance and Time</h4>
            <p>Distance: {distanceAndTime.distance}</p>
            <p>Estimated time: {distanceAndTime.duration}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindaRide;
