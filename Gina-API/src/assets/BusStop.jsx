import { useEffect, useState } from "react"; // Import React hooks

// This component handles fetching and displaying bus stop information
function BusStop() {
  // State to hold the submitted stop ID
  const [stopId, setStopId] = useState('');
  
  // State to track what the user is typing in the input field
  const [inputStopId, setInputStopId] = useState('');
  
  // State to hold the data returned from the API
  const [stopInfo, setStopInfo] = useState(null);
  
  // Loading state to show loading feedback
  const [loading, setLoading] = useState(false);
  
  // Error state for displaying any issues
  const [error, setError] = useState(null);

  // Runs whenever stopId changes, and triggers the fetch function
  useEffect(() => {
    if (stopId) {
      fetchStopInfo();
    }
  }, [stopId]);

  // This async function fetches bus stop data from the Auckland Transport API
  const fetchStopInfo = async () => {
    setLoading(true); // Start loading
    setError(null);   // Clear any previous error

    try {
      // Use the current stopId in the API URL
      const apiUrl = `https://pp-api.at.govt.nz/gtfs/v3/stops/${stopId}`;

      // Send GET request with required headers
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': '18db40a7d1f84e74ae59d31092f05902'
        }
      });

      // If response is not OK (e.g. 404 or 500), throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse JSON from the response
      const data = await response.json();

      // If data exists, set it into state
      if (data && data.data) {
        setStopInfo(data.data);
      } else {
        setStopInfo(null);
        setError('No information found for this ID');
      }

    } catch (err) {
      // Catch any errors during the fetch process
      setError('Failed to fetch stop information');
      console.error('Error:', err);
    } finally {
      // Always turn off the loading spinner
      setLoading(false);
    }
  };

  // Handles the form submission: updates the stopId (which triggers fetch)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    setStopId(inputStopId); // Update stopId which triggers useEffect
  };

  return (
    <div className="app">
      <h1>Auckland Transport Stop Info</h1>

      {/* Input form for user to enter a bus stop ID */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="stopId">Bus Stop ID:</label>
        <input
          id="stopId"
          type="text"
          value={inputStopId}
          onChange={(e) => setInputStopId(e.target.value)} // Update input as user types
          placeholder="Enter stop ID"
          required
        />
        <button type="submit">Get Info</button>
      </form>

      {/* Show error message if something went wrong */}
      {error && <p className="error">{error}</p>}

      {/* Show loading message while fetching */}
      {loading && <p>Loading...</p>}

      {/* Show bus stop info once it’s fetched and not loading */}
      {stopInfo && !loading && (
        <div>
          <h2>Stop: {stopInfo.attributes.stop_name || 'N/A'}</h2>
          <p>Stop Code: {stopInfo.attributes.stop_code || 'N/A'}</p>
          <p>Location: Lat: {stopInfo.attributes.stop_lat}, Lon: {stopInfo.attributes.stop_lon}</p>
        </div>
      )}
    </div>
  );
}

// Export this component so it can be used in App.jsx
export default BusStop;
