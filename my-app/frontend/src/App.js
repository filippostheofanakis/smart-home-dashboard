// Frontend Code (React Component)

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [smartLight, setSmartLight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the smart light data from the backend
  useEffect(() => {
    let isMounted = true; // Track whether the component is mounted
    setIsLoading(true);

    fetch('http://localhost:5000/api/smart-light')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (isMounted) {
          setSmartLight(data);
          setIsLoading(false);
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setError(error);
          setIsLoading(false);
        }
      });

    // Cleanup function to set isMounted to false when the component unmounts
    return () => { isMounted = false };
  }, []);

  // Function to toggle the smart light state
  const toggleSmartLight = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/smart-light', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setSmartLight(data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error updating data:', error);
      setError(error);
      setIsLoading(false);
    });
  };

  // Render the component
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <p>Smart Home Dashboard</p>
        {smartLight && (
          <div>
            <p>{`Smart Light is currently ${smartLight.status.toUpperCase()}`}</p>
            <button onClick={toggleSmartLight} disabled={isLoading}>
              Toggle Light
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
