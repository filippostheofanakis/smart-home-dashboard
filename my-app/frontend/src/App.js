//App.js
// Frontend Code (React Component)

import React, { useState, useEffect } from 'react';
// import './App.css';
import './Dashboard.css';

;

function App() {
  const [smartLight, setSmartLight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);

  // State to hold the new device name and status
const [newDeviceName, setNewDeviceName] = useState('');
const [newDeviceStatus, setNewDeviceStatus] = useState('off')
// State to track which device is being edited
const [editingDeviceId, setEditingDeviceId] = useState(null);
const [editForm, setEditForm] = useState({ name: "", status: "" });

// Function to set a device in edit mode
const editDevice = (device) => {
  setEditingDeviceId(device._id);
  setEditForm({ name: device.name, status: device.status });
};



// Function to save the edited device
const saveDevice = async (deviceId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editForm.name, status: editForm.status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedDevice = await response.json();
    // Update the devices state with the updated device
    setDevices(devices.map(device => device._id === deviceId ? updatedDevice : device));
    setEditingDeviceId(null); // Exit edit mode
  } catch (error) {
    console.error('Error updating device:', error);
  }
};

    // Fetch all devices from the backend
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/devices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
          setDevices(data);
        
      } catch (error) {
        
          console.error('Error fetching devices:', error);
          setError(error);
        
      }
    };


  // Fetch the smart light data from the backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
  
    // Fetch the smart light data from the backend
    const fetchSmartLight = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/smart-light');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setSmartLight(data);
        }
        if (!response.ok) {
          if (response.status === 404) {
            // Handle the case where the smart light device is not found
            setError(new Error('Smart light device not found. Please set up a new smart light.'));
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching smart light data:', error);
          setError(error);
        }
      }
    };
  

  
    // Execute both fetch requests
    const fetchData = async () => {
      await fetchSmartLight();
      await fetchDevices();
      if (isMounted) {
        setIsLoading(false);
      }
    };
  
    fetchData();
  
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
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
        if (response.status === 404) {
          // Handle the case where the device is not found
          console.error('Device not found. Please add a new device.');
          throw new Error('Device not found. Please add a new device.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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


  // Function to add a new device
const addDevice = async (deviceData) => {
  try {
    const response = await fetch('http://localhost:5000/api/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newDevice = await response.json();
    // Update state to include the new device
    setDevices([...devices, newDevice]); // Update state to include the new device

  } catch (error) {
    console.error('Error adding new device:', error);
    // Handle error state
  }
};

// Function to handle the form submission for a new device
const handleAddDevice = (e) => {
  e.preventDefault(); // Prevent the default form submit action
  addDevice({
    name: newDeviceName,
    status: newDeviceStatus,
  });
  // Reset the form fields
  setNewDeviceName('');
  setNewDeviceStatus('off');
};

// Function to delete a device
const deleteDevice = async (deviceId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // If the server responds with an error, throw an exception
      throw new Error(`Failed to delete the device with status: ${response.status}`);
    }

    // Use the previous state to filter out the device that's been deleted
    setDevices(prevDevices => prevDevices.filter(device => device._id !== deviceId));
  } catch (error) {
    console.error('Error deleting device:', error);
  }
};

// Example function to call the PUT endpoint from the frontend
const updateDevice = async (deviceId, updatedName, updatedStatus) => {
  try {
    const response = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: updatedName, status: updatedStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to update the device');
    }

    const updatedDevice = await response.json();
    // Handle the updated device (e.g., update state to re-render the UI)
  } catch (error) {
    console.error('Error updating device:', error);
    // Handle error (e.g., show error message to the user)
  }
};

const toggleDeviceStatus = async (deviceId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'on' ? 'off' : 'on';
    const response = await fetch(`http://localhost:5000/api/devices/${deviceId}/toggle`, { // Adjust this endpoint as needed
      method: 'PUT', // Assuming you're using PUT to update the device status
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error('Failed to toggle device status');

    const updatedDevice = await response.json();
    console.log('Updated device:', updatedDevice);

    // Refresh the device list to reflect the change
    fetchDevices(); // Make sure you have this function implemented
  } catch (error) {
    console.error('Error toggling device status:', error);
  }
};


  // Render the component
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <p>Smart Home Dashboard</p>
<form onSubmit={handleAddDevice} className="Form">
    <input
      type="text"
      value={newDeviceName}
      onChange={(e) => setNewDeviceName(e.target.value)}
      placeholder="Device Name"
      required
      className="Input" 
    />
    <select
      value={newDeviceStatus}
      onChange={(e) => setNewDeviceStatus(e.target.value)}
      className="Select"
    >
      <option value="off">Off</option>
      <option value="on">On</option>
    </select>
    <button type="submit" className="Button">Add Device</button>
    </form>
    <ul className="Device-list">
  {devices.map(device => (
    <li key={device._id} className="Device-item">
      {editingDeviceId === device._id ? (
        <div>
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <select
            value={editForm.status}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
          >
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
          <button onClick={() => saveDevice(device._id)}>Save</button>
          <button onClick={() => setEditingDeviceId(null)}>Cancel</button>
        </div>
      ) : (
        <div>
          <span className="Device-name">{device.name} - {device.status}</span>
          <button onClick={() => editDevice(device)}>Edit</button>
          <button onClick={() => toggleDeviceStatus(device._id, device.status)}>Toggle</button> 
          <button onClick={() => deleteDevice(device._id)} className="Device-button">Delete</button>
        </div>
      )}
    </li>
  ))}
</ul>

{/* <button onClick={() => toggleDeviceStatus(device.id, !device.isOn)}>
  {device.isOn ? 'Turn Off' : 'Turn On'}
</button> */}

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
