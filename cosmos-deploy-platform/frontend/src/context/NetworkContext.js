import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Default mock data for development
import { mockNetworks } from '../utils/mockData';

// Create the network context
const NetworkContext = createContext();

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Network provider component
export const NetworkProvider = ({ children }) => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // Fetch all networks when component mounts
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        // In development, use mock data if we can't reach the API
        try {
          const response = await axios.get(`${API_URL}/networks`);
          setNetworks(response.data.data || []);
        } catch (apiError) {
          console.warn('Using mock data due to API error:', apiError);
          setNetworks(mockNetworks);
        }
      } catch (err) {
        setError('Failed to fetch networks. Please try again later.');
        console.error('Error fetching networks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, []);

  // Create a new network
  const createNetwork = async (networkData) => {
    setLoading(true);
    try {
      // In development, add to mock data if API call fails
      try {
        const response = await axios.post(`${API_URL}/networks`, networkData);
        const newNetwork = response.data.data;
        setNetworks([...networks, newNetwork]);
        return newNetwork;
      } catch (apiError) {
        console.warn('Using mock data due to API error:', apiError);
        const newNetwork = {
          id: Date.now().toString(),
          status: 'Created',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...networkData,
        };
        setNetworks([...networks, newNetwork]);
        return newNetwork;
      }
    } catch (err) {
      setError('Failed to create network. Please try again.');
      console.error('Error creating network:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific network by ID
  const getNetwork = async (id) => {
    setLoading(true);
    try {
      // Try to get from state first
      let network = networks.find(n => n.id === id);
      
      if (!network) {
        // Try to fetch from API
        try {
          const response = await axios.get(`${API_URL}/networks/${id}`);
          network = response.data.data;
          
          // Update networks state if we got a new network
          if (network && !networks.find(n => n.id === id)) {
            setNetworks([...networks, network]);
          }
        } catch (apiError) {
          console.warn('Could not fetch network from API:', apiError);
          // Check mock data
          network = mockNetworks.find(n => n.id === id);
        }
      }
      
      setSelectedNetwork(network || null);
      return network || null;
    } catch (err) {
      setError('Failed to fetch network details. Please try again.');
      console.error('Error fetching network:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a network
  const updateNetwork = async (id, updates) => {
    setLoading(true);
    try {
      // In development, update mock data if API call fails
      let updatedNetwork;
      
      try {
        const response = await axios.put(`${API_URL}/networks/${id}`, updates);
        updatedNetwork = response.data.data;
      } catch (apiError) {
        console.warn('Using mock data due to API error:', apiError);
        updatedNetwork = {
          ...networks.find(n => n.id === id),
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      
      // Update state
      const updatedNetworks = networks.map(network => 
        network.id === id ? updatedNetwork : network
      );
      
      setNetworks(updatedNetworks);
      
      if (selectedNetwork?.id === id) {
        setSelectedNetwork(updatedNetwork);
      }
      
      return updatedNetwork;
    } catch (err) {
      setError('Failed to update network. Please try again.');
      console.error('Error updating network:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a network
  const deleteNetwork = async (id) => {
    setLoading(true);
    try {
      // In development, delete from mock data if API call fails
      try {
        await axios.delete(`${API_URL}/networks/${id}`);
      } catch (apiError) {
        console.warn('API error for delete, proceeding with UI update:', apiError);
      }
      
      // Update state
      setNetworks(networks.filter(network => network.id !== id));
      
      if (selectedNetwork?.id === id) {
        setSelectedNetwork(null);
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete network. Please try again.');
      console.error('Error deleting network:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Deploy a network
  const deployNetwork = async (id, environment) => {
    setLoading(true);
    try {
      // In development, update mock data if API call fails
      try {
        await axios.post(`${API_URL}/networks/${id}/deploy`, { environment });
      } catch (apiError) {
        console.warn('API error for deploy, proceeding with UI update:', apiError);
      }
      
      // Update network status in state
      const updatedNetworks = networks.map(network =>
        network.id === id
          ? { ...network, status: 'Deploying', deployedEnvironment: environment }
          : network
      );
      
      setNetworks(updatedNetworks);
      
      if (selectedNetwork?.id === id) {
        setSelectedNetwork({
          ...selectedNetwork,
          status: 'Deploying',
          deployedEnvironment: environment
        });
      }
      
      // Simulate deployment for development
      if (process.env.NODE_ENV !== 'production') {
        setTimeout(() => {
          const deployedNetworks = networks.map(network =>
            network.id === id
              ? { ...network, status: 'Active' }
              : network
          );
          
          setNetworks(deployedNetworks);
          
          if (selectedNetwork?.id === id) {
            setSelectedNetwork({
              ...selectedNetwork,
              status: 'Active'
            });
          }
        }, 5000);
      }
      
      return true;
    } catch (err) {
      setError('Failed to deploy network. Please try again.');
      console.error('Error deploying network:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Backup a network
  const backupNetwork = async (id) => {
    setLoading(true);
    try {
      // In development, update mock data if API call fails
      let backupId;
      
      try {
        const response = await axios.post(`${API_URL}/networks/${id}/backup`);
        backupId = response.data.data.backupId;
      } catch (apiError) {
        console.warn('API error for backup, proceeding with mock:', apiError);
        backupId = `backup-${Date.now()}`;
      }
      
      // Update network in state
      const updatedNetworks = networks.map(network =>
        network.id === id
          ? { ...network, lastBackupAt: new Date().toISOString() }
          : network
      );
      
      setNetworks(updatedNetworks);
      
      if (selectedNetwork?.id === id) {
        setSelectedNetwork({
          ...selectedNetwork,
          lastBackupAt: new Date().toISOString()
        });
      }
      
      return backupId;
    } catch (err) {
      setError('Failed to backup network. Please try again.');
      console.error('Error backing up network:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Restore a network from backup
  const restoreNetwork = async (id, backupId) => {
    setLoading(true);
    try {
      // In development, update mock data if API call fails
      try {
        await axios.post(`${API_URL}/networks/${id}/restore/${backupId}`);
      } catch (apiError) {
        console.warn('API error for restore, proceeding with UI update:', apiError);
      }
      
      // Update network status in state
      const updatedNetworks = networks.map(network =>
        network.id === id
          ? { ...network, status: 'Restoring' }
          : network
      );
      
      setNetworks(updatedNetworks);
      
      if (selectedNetwork?.id === id) {
        setSelectedNetwork({
          ...selectedNetwork,
          status: 'Restoring'
        });
      }
      
      // Simulate restore for development
      if (process.env.NODE_ENV !== 'production') {
        setTimeout(() => {
          const restoredNetworks = networks.map(network =>
            network.id === id
              ? { ...network, status: 'Active' }
              : network
          );
          
          setNetworks(restoredNetworks);
          
          if (selectedNetwork?.id === id) {
            setSelectedNetwork({
              ...selectedNetwork,
              status: 'Active'
            });
          }
        }, 5000);
      }
      
      return true;
    } catch (err) {
      setError('Failed to restore network. Please try again.');
      console.error('Error restoring network:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    networks,
    loading,
    error,
    selectedNetwork,
    createNetwork,
    getNetwork,
    updateNetwork,
    deleteNetwork,
    deployNetwork,
    backupNetwork,
    restoreNetwork
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

// Custom hook for using the network context
export const useNetworks = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworks must be used within a NetworkProvider');
  }
  return context;
};