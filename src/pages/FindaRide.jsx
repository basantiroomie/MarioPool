import React, { useState } from 'react';
import MapComponent, { nearbyFriendCoordinates, destinationCoordinate } from '../components/MapComponent'; // Import the map component and coordinates

const FindaRide = () => {
  // Transform nearbyFriendCoordinates into objects with lat/lon, age, and gender for display purposes
  const nearbyFriends = nearbyFriendCoordinates.map((friend, index) => ({
    name: `Friend ${index + 1}`, // Assign names (Friend 1, Friend 2, etc.)
    lat: friend.coords[1],  // Latitude is the second element
    lon: friend.coords[0],  // Longitude is the first element
    age: friend.age,
    gender: friend.gender,
  }));

  // State for the selected friend
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Handle friend selection from the dropdown
  const handleSelectFriend = (event) => {
    const friendIndex = event.target.value;
    setSelectedFriend(nearbyFriends[friendIndex]);
  };

  // Handle "Call" button click
  const handleCall = () => {
    if (selectedFriend) {
      alert(`Calling ${selectedFriend.name}...`);
    }
  };

  // Handle "Start Ride" button click
  const handleStartRide = () => {
    if (selectedFriend) {
      alert(`Starting the ride with ${selectedFriend.name}...`);
    }
  };

  return (
    <div>
      {/* Header */}
      <header>
        <h1>Start Carpooling</h1>
        <p>Find your friends and start carpooling together!</p>
      </header>

      {/* Show the map */}
      <MapComponent 
        sourceCoordinate={selectedFriend ? [selectedFriend.lon, selectedFriend.lat] : nearbyFriendCoordinates[0].coords} 
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
                <td>{`Lat: ${friend.lat}, Lon: ${friend.lon}`}</td> {/* Display the coordinates */}
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

      {/* Show Call and Start Ride buttons if a friend is selected */}
      {selectedFriend && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleCall}>Call {selectedFriend.name}</button>
          <button onClick={handleStartRide} style={{ marginLeft: '10px' }}>Start Ride</button>
        </div>
      )}
    </div>
  );
};

export default FindaRide;
