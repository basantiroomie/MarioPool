import React, { useState } from 'react';
import MapComponent, { nearbyFriendCoordinates, destinationCoordinate, sourceCoordinate } from '../components/MapComponent'; // Import the map component and coordinates
import axios from 'axios'; // Import axios for API requests

const FindaRide = () => {
  // Transform nearbyFriendCoordinates into objects with lat/lon, age, and gender for display purposes
  const nearbyFriends = nearbyFriendCoordinates.map((friend, index) => ({
    name: `Friend ${index + 1}`,
    lat: friend.coords[1],  // Latitude is the second element
    lon: friend.coords[0],  // Longitude is the first element
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

    // Call the Google Distance Matrix API to calculate the distance and time
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${sourceCoordinate[1]},${sourceCoordinate[0]}&destinations=${selected.lat},${selected.lon}&key=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      const data = response.data.rows[0].elements[0];
      
      // Update state with distance and duration
      setDistanceAndTime({
        distance: data.distance.text,
        duration: data.duration.text
      });
    } catch (error) {
      console.error('Error fetching distance matrix:', error);
    }
  };

  // Handle "Call" button click
  const handleCall = () => {
    if (selectedFriend) {
      alert(`Calling ${selectedFriend.name}...`);
    }
  };

  // Handle "Open in Google Maps" button to show source, friend, and destination in Google Maps
  const handleViewInMaps = () => {
    if (selectedFriend) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${sourceCoordinate[1]},${sourceCoordinate[0]}&destination=${destinationCoordinate[1]},${destinationCoordinate[0]}&waypoints=${selectedFriend.lat},${selectedFriend.lon}`;
      window.open(googleMapsUrl, '_blank'); // Opens Google Maps in a new tab
    }
  };

  return (
    <div>
      {/* Header */}
      <header>
        <h1>Find A Ride</h1>
        <p>Find your friends and start carpooling together!</p>
      </header>

      {/* Show the map */}
      <MapComponent 
        sourceCoordinate={sourceCoordinate}
        nearbyFriendCoordinates={nearbyFriendCoordinates} // Pass raw coordinates to MapComponent
        destinationCoordinate={destinationCoordinate} 
      />

      {/* Display all friends' details in tabular form */}
      <div style={{ marginTop: '20px' }}>
        <h3>Nearby Friends Details</h3>
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '50%' }}>
          <thead>
            <tr>
              <th>Friend</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {nearbyFriends.map((friend, index) => (
              <tr key={index}>
                <td>{friend.name}</td>
                <td>{friend.age}</td>
                <td>{friend.gender}</td>
                <td>{`Lat: ${friend.lat}, Lon: ${friend.lon}`}</td> {/* Use backticks for string interpolation */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dropdown to select a nearby friend */}
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

      {/* Show Call, View in Maps buttons, and distance/time if a friend is selected */}
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

