import React, { useState, useRef, useEffect } from 'react';
import 'ol/ol.css'; // Import OpenLayers CSS
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj'; // To transform coordinates
import { useNavigate } from 'react-router-dom';

const RegisterLogin = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    car: '',
    age: '',
    gender: '',
    password: '',
    flatNumber: '',
    homeAddress: '',
    pincode: '',
    company: '',
  });
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [companyLat, setCompanyLat] = useState(''); // For selected company's latitude
  const [companyLon, setCompanyLon] = useState(''); // For selected company's longitude
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();

  // Predefined company locations
  const companyCoordinates = {
    'Samsung - Electronic City': { lat: 12.841, lon: 77.663 },
    'Samsung - Whitefield': { lat: 12.978, lon: 77.751 },
    'Samsung - Koramangala': { lat: 12.935, lon: 77.622 },
    'TCS - Manyata Tech Park': { lat: 13.050, lon: 77.630 },
    'TCS - Electronic City': { lat: 12.839, lon: 77.680 },
    'TCS - Whitefield': { lat: 12.974, lon: 77.737 },
    'IBM - Manyata Tech Park': { lat: 13.052, lon: 77.631 },
    'IBM - Whitefield': { lat: 12.976, lon: 77.733 },
    'IBM - Bannerghatta Road': { lat: 12.896, lon: 77.599 },
    'Infosys - Electronic City': { lat: 12.845, lon: 77.665 },
    'Infosys - Bannerghatta Road': { lat: 12.897, lon: 77.601 },
    'Infosys - Whitefield': { lat: 12.975, lon: 77.734 },
    'Wipro - Sarjapur Road': { lat: 12.870, lon: 77.667 },
    'Wipro - Electronic City': { lat: 12.842, lon: 77.667 },
    'Wipro - Whitefield': { lat: 12.979, lon: 77.748 },
  };

  useEffect(() => {
    // Check for existing profile data in localStorage when the component mounts
    const savedProfileData = JSON.parse(localStorage.getItem('profileData'));
    if (savedProfileData) {
      setFormData(savedProfileData.formData);
      setLat(savedProfileData.lat);
      setLon(savedProfileData.lon);
      setCompanyLat(savedProfileData.companyLat);
      setCompanyLon(savedProfileData.companyLon);
    }
  }, []);

  // Store formData and coordinates in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify({
      formData,
      lat,
      lon,
      companyLat,
      companyLon,
    }));
  }, [formData, lat, lon, companyLat, companyLon]); // Trigger when any of these change

  // Function to fetch coordinates from pincode
  const getCoordinatesFromPincode = async (enteredPincode) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${enteredPincode}&country=India&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLat(lat);
        setLon(lon);
        return { lat, lon };
      } else {
        alert('Coordinates not found for this pincode');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
    return null;
  };

  // Handle input changes for all form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle pincode change and fetch coordinates
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setFormData({ ...formData, pincode });
    if (pincode.length === 6) {
      const coordinates = await getCoordinatesFromPincode(pincode);
      if (coordinates && map) {
        const { lat, lon } = coordinates;
        const view = map.getView();
        const newCenter = fromLonLat([parseFloat(lon), parseFloat(lat)]);
        view.setCenter(newCenter);
        view.setZoom(14); // Zoom closer to the location
      }
    }
  };

  // Handle company selection and update map with company's lat/lon
  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    const { lat, lon } = companyCoordinates[selectedCompany];
    setCompanyLat(lat);
    setCompanyLon(lon);
    setFormData({ ...formData, company: selectedCompany });
    if (map) {
      const view = map.getView();
      const newCenter = fromLonLat([lon, lat]);
      view.setCenter(newCenter);
      view.setZoom(14); // Zoom closer to the company location
    }
  };

  // Initialize the map when coordinates are available
  useEffect(() => {
    if (lat && lon && !mapInitialized) {
      const initialMap = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([parseFloat(lon), parseFloat(lat)]),
          zoom: 14, // Initial zoom level
        }),
      });
      setMap(initialMap);
      setMapInitialized(true); // Mark the map as initialized
    }
  }, [lat, lon, mapInitialized]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      lat, // From map coordinates
      lon, // From map coordinates
      companyLat,
      companyLon,
    };

    try {
      const response = await fetch('http://localhost:5000/save-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();
      alert(result.message);
      setSubmittedData(finalData);
      navigate('/Profile', { state: { registeredData: finalData } });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div>
      <h2>Sign Up or Login</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {/* New field: Do you have a car */}
        <label style={{ marginTop: '10px', display: 'block' }}>
          Do you have a car?
        </label>
        <select
          name="car"
          value={formData.car}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {/* New field: Age */}
        <input
          type="number"
          name="age"
          placeholder="Age"
          style={{ marginTop: '10px' }}
          value={formData.age}
          onChange={handleChange}
        />
        {/* New field: Gender */}
        <label style={{ marginTop: '10px', display: 'block' }}>
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="flatNumber"
          placeholder="Flat Number"
          value={formData.flatNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="homeAddress"
          placeholder="Home Address"
          value={formData.homeAddress}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handlePincodeChange}
        />
        <label style={{ marginTop: '10px', display: 'block' }}>
          Select Company
        </label>
        <select
          name="company"
          value={formData.company}
          onChange={handleCompanyChange}
        >
          <option value="">Select</option>
          {Object.keys(companyCoordinates).map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
        <label>
          <input type="checkbox" /> I agree to the terms and conditions
        </label>
        <button type="submit">Register</button>
      </form>
      <div
        ref={mapElement}
        style={{ width: '100%', height: '400px', marginTop: '20px' }} // Adjust height as needed
      />
      {submittedData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Profile Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RegisterLogin;