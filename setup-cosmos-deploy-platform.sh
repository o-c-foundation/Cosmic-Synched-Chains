#!/bin/bash

# Cosmos Deploy Platform - Setup Script
# This script automates the creation and initialization of the Cosmos Deploy Platform

set -e

echo "==== Cosmos Deploy Platform Setup ===="
echo "Creating project structure..."

# Create base directory structure
mkdir -p cosmos-deploy-platform/{frontend/{public,src/{components,pages,services,context,hooks,utils}},backend/src/{controllers,models,routes,services,utils,middlewares,config},infrastructure/{terraform,kubernetes,docker,ansible,templates},docs/{user-guides,developer-guides,api-docs,architecture}}

# Initialize frontend with React, TypeScript, and dependencies
echo "Setting up frontend..."
cd cosmos-deploy-platform/frontend
npm init -y
npm install react react-dom react-router-dom typescript @types/react @types/react-dom @types/node
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install formik yup axios chart.js react-chartjs-2
npm install @monaco-editor/react react-json-view
npm install -D webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript css-loader style-loader file-loader

# Create basic frontend files
echo "Creating frontend base files..."
cat > public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Cosmos Deploy Platform - Deploy and manage Cosmos blockchains easily" />
  <title>Cosmos Deploy Platform</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
EOL

cat > src/index.tsx << 'EOL'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
EOL

cat > src/theme.ts << 'EOL'
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E3192', // Cosmos blue
      light: '#5357C5',
      dark: '#1A1C63',
    },
    secondary: {
      main: '#E50278', // Cosmos pink
      light: '#FF4DA5',
      dark: '#AD004F',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
EOL

cat > src/App.tsx << 'EOL'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NetworkCreation from './pages/NetworkCreation';
import NetworksList from './pages/NetworksList';
import NetworkDetails from './pages/NetworkDetails';
import Monitoring from './pages/Monitoring';
import Governance from './pages/Governance';
import Settings from './pages/Settings';
import { NetworkProvider } from './context/NetworkContext';

const App: React.FC = () => {
  return (
    <NetworkProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-network" element={<NetworkCreation />} />
            <Route path="/networks" element={<NetworksList />} />
            <Route path="/networks/:id" element={<NetworkDetails />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </NetworkProvider>
  );
};

export default App;
EOL

mkdir -p src/components/Layout
cat > src/components/Layout/Layout.tsx << 'EOL'
import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import MonitorIcon from '@mui/icons-material/Monitor';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Create Network', icon: <AddCircleOutlineIcon />, path: '/create-network' },
    { text: 'My Networks', icon: <ViewListIcon />, path: '/networks' },
    { text: 'Monitoring', icon: <MonitorIcon />, path: '/monitoring' },
    { text: 'Governance', icon: <HowToVoteIcon />, path: '/governance' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];
  
  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" color="primary" fontWeight="bold">
          Cosmos Deploy
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'primary.main',
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              borderRadius: '0 20px 20px 0',
              marginRight: '8px',
              marginY: '4px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid #eaeaea'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(item => item.path === location.pathname)?.text || 'Cosmos Deploy Platform'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, marginTop: '64px' }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
EOL

mkdir -p src/context
cat > src/context/NetworkContext.tsx << 'EOL'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Network, NetworkConfig } from '../types/network';
import { mockNetworks } from '../utils/mockData';

interface NetworkContextType {
  networks: Network[];
  loading: boolean;
  error: string | null;
  selectedNetwork: Network | null;
  createNetwork: (config: NetworkConfig) => Promise<Network>;
  getNetwork: (id: string) => Promise<Network | null>;
  updateNetwork: (id: string, updates: Partial<Network>) => Promise<Network>;
  deleteNetwork: (id: string) => Promise<boolean>;
  deployNetwork: (id: string, environment: string) => Promise<boolean>;
  backupNetwork: (id: string) => Promise<string>;
  restoreNetwork: (id: string, backupId: string) => Promise<boolean>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

  // Load initial data
  useEffect(() => {
    // In a real app, this would be an API call
    setNetworks(mockNetworks);
    setLoading(false);
  }, []);

  // Create a new network
  const createNetwork = async (config: NetworkConfig): Promise<Network> => {
    // This would be an API call in a real app
    const newNetwork: Network = {
      id: Date.now().toString(),
      status: 'Created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...config,
    };
    
    setNetworks(prev => [...prev, newNetwork]);
    return newNetwork;
  };

  // Get network by ID
  const getNetwork = async (id: string): Promise<Network | null> => {
    const network = networks.find(n => n.id === id) || null;
    setSelectedNetwork(network);
    return network;
  };

  // Update network
  const updateNetwork = async (id: string, updates: Partial<Network>): Promise<Network> => {
    const updatedNetworks = networks.map(network => 
      network.id === id 
        ? { ...network, ...updates, updatedAt: new Date().toISOString() } 
        : network
    );
    
    setNetworks(updatedNetworks);
    const updatedNetwork = updatedNetworks.find(n => n.id === id)!;
    if (selectedNetwork?.id === id) {
      setSelectedNetwork(updatedNetwork);
    }
    
    return updatedNetwork;
  };

  // Delete network
  const deleteNetwork = async (id: string): Promise<boolean> => {
    setNetworks(networks.filter(network => network.id !== id));
    if (selectedNetwork?.id === id) {
      setSelectedNetwork(null);
    }
    return true;
  };

  // Deploy network
  const deployNetwork = async (id: string, environment: string): Promise<boolean> => {
    // In a real app, this would trigger deployment infrastructure
    await updateNetwork(id, { 
      status: 'Deploying',
      deployedEnvironment: environment
    });
    
    // Simulate deployment time
    setTimeout(() => {
      updateNetwork(id, { status: 'Active' });
    }, 5000);
    
    return true;
  };

  // Backup network
  const backupNetwork = async (id: string): Promise<string> => {
    // In a real app, this would trigger a backup process
    const backupId = `backup-${Date.now()}`;
    await updateNetwork(id, { 
      lastBackupAt: new Date().toISOString(),
    });
    
    return backupId;
  };

  // Restore network
  const restoreNetwork = async (id: string, backupId: string): Promise<boolean> => {
    // In a real app, this would restore from a backup
    await updateNetwork(id, { 
      status: 'Restoring',
    });
    
    // Simulate restore time
    setTimeout(() => {
      updateNetwork(id, { status: 'Active' });
    }, 5000);
    
    return true;
  };

  return (
    <NetworkContext.Provider
      value={{
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
        restoreNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworks = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetworks must be used within a NetworkProvider');
  }
  return context;
};
EOL

mkdir -p src/types
cat > src/types/network.ts << 'EOL'
export interface TokenEconomics {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  maxSupply: number | null;
  distribution: {
    validators: number;
    community: number;
    foundation: number;
    airdrop: number;
  };
}

export interface ValidatorRequirements {
  minStake: number;
  maxValidators: number | null;
  unbondingPeriod: number; // in days
}

export interface GovernanceSettings {
  votingPeriod: number; // in days
  quorum: number; // percentage
  threshold: number; // percentage
  vetoThreshold: number; // percentage
}

export interface Module {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface NetworkConfig {
  name: string;
  chainId: string;
  description: string;
  tokenEconomics: TokenEconomics;
  validatorRequirements: ValidatorRequirements;
  governanceSettings: GovernanceSettings;
  modules: Module[];
}

export type NetworkStatus = 'Created' | 'Deploying' | 'Active' | 'Inactive' | 'Failed' | 'Updating' | 'Restoring';

export interface NetworkMetrics {
  blockHeight: number;
  blockTime: number; // in seconds
  activeValidators: number;
  totalStaked: number;
  transactions: {
    total: number;
    perSecond: number;
  };
}

export interface Network extends NetworkConfig {
  id: string;
  status: NetworkStatus;
  createdAt: string;
  updatedAt: string;
  deployedEnvironment?: string;
  metrics?: NetworkMetrics;
  lastBackupAt?: string;
}

export interface Validator {
  address: string;
  moniker: string;
  identity: string;
  website: string;
  details: string;
  commission: number;
  uptime: number;
  stake: number;
  status: 'Active' | 'Jailed' | 'Tombstoned';
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  type: string;
  status: 'Deposit' | 'Voting' | 'Passed' | 'Rejected' | 'Failed';
  submitTime: string;
  depositEndTime: string;
  votingStartTime: string;
  votingEndTime: string;
  totalDeposit: number;
  votes: {
    yes: number;
    no: number;
    noWithVeto: number;
    abstain: number;
  };
}
EOL

mkdir -p src/utils
cat > src/utils/mockData.ts << 'EOL'
import { Network, Validator, Proposal } from '../types/network';

// Mock networks for development
export const mockNetworks: Network[] = [
  {
    id: '1',
    name: 'MyCosmosChain',
    chainId: 'mycosmos-1',
    description: 'A test Cosmos blockchain for development',
    status: 'Active',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T14:45:00Z',
    deployedEnvironment: 'local',
    lastBackupAt: '2023-01-20T08:15:00Z',
    tokenEconomics: {
      name: 'MyCoin',
      symbol: 'MYC',
      decimals: 6,
      initialSupply: 100000000,
      maxSupply: 200000000,
      distribution: {
        validators: 10,
        community: 40,
        foundation: 30,
        airdrop: 20,
      },
    },
    validatorRequirements: {
      minStake: 1000,
      maxValidators: 100,
      unbondingPeriod: 21,
    },
    governanceSettings: {
      votingPeriod: 14,
      quorum: 33.4,
      threshold: 50,
      vetoThreshold: 33.4,
    },
    modules: [
      {
        id: 'bank',
        name: 'Bank',
        enabled: true,
        config: {},
      },
      {
        id: 'staking',
        name: 'Staking',
        enabled: true,
        config: {
          minCommissionRate: 5,
        },
      },
      {
        id: 'gov',
        name: 'Governance',
        enabled: true,
        config: {
          minDeposit: 10000,
        },
      },
      {
        id: 'ibc',
        name: 'IBC',
        enabled: true,
        config: {},
      },
    ],
    metrics: {
      blockHeight: 1245678,
      blockTime: 6.2,
      activeValidators: 50,
      totalStaked: 75000000,
      transactions: {
        total: 9876543,
        perSecond: 12.5,
      },
    },
  },
  {
    id: '2',
    name: 'Enterprise Chain',
    chainId: 'enterprise-1',
    description: 'Private enterprise blockchain with permissioned validators',
    status: 'Created',
    createdAt: '2023-02-10T09:20:00Z',
    updatedAt: '2023-02-10T09:20:00Z',
    tokenEconomics: {
      name: 'Enterprise Token',
      symbol: 'ENT',
      decimals: 8,
      initialSupply: 50000000,
      maxSupply: null,
      distribution: {
        validators: 60,
        community: 0,
        foundation: 40,
        airdrop: 0,
      },
    },
    validatorRequirements: {
      minStake: 10000,
      maxValidators: 10,
      unbondingPeriod: 7,
    },
    governanceSettings: {
      votingPeriod: 3,
      quorum: 51,
      threshold: 67,
      vetoThreshold: 0,
    },
    modules: [
      {
        id: 'bank',
        name: 'Bank',
        enabled: true,
        config: {},
      },
      {
        id: 'staking',
        name: 'Staking',
        enabled: true,
        config: {
          minCommissionRate: 0,
        },
      },
      {
        id: 'gov',
        name: 'Governance',
        enabled: true,
        config: {
          minDeposit: 5000,
        },
      },
      {
        id: 'ibc',
        name: 'IBC',
        enabled: false,
        config: {},
      },
      {
        id: 'wasm',
        name: 'CosmWasm',
        enabled: true,
        config: {
          allowedAddresses: ['enterprise1...', 'enterprise2...'],
        },
      },
    ],
  },
];

// Mock validators
export const mockValidators: Validator[] = [
  {
    address: 'cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf',
    moniker: 'Validator One',
    identity: '1234ABCD',
    website: 'https://validator-one.example',
    details: 'Professional validator service with 99.9% uptime',
    commission: 5,
    uptime: 99.98,
    stake: 5000000,
    status: 'Active',
  },
  {
    address: 'cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0',
    moniker: 'Validator Two',
    identity: '5678EFGH',
    website: 'https://validator-two.example',
    details: 'Community validator run by enthusiasts',
    commission: 3,
    uptime: 99.75,
    stake: 2500000,
    status: 'Active',
  },
  {
    address: 'cosmosvaloper1ey69r37gfxvxg62sh4r0ktpuc46pzjrm873ae8',
    moniker: 'Validator Three',
    identity: '9012IJKL',
    website: 'https://validator-three.example',
    details: 'Secure and reliable validation service',
    commission: 8,
    uptime: 100.00,
    stake: 3750000,
    status: 'Active',
  },
  {
    address: 'cosmosvaloper1hjct6q7npsspsg3dgvzk3sdf89spmlpfdn6m9d',
    moniker: 'Validator Four',
    identity: '3456MNOP',
    website: 'https://validator-four.example',
    details: 'High-performance validator with dedicated hardware',
    commission: 10,
    uptime: 98.50,
    stake: 1800000,
    status: 'Jailed',
  },
];

// Mock proposals
export const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Increase Max Validators',
    description: 'Proposal to increase the maximum number of validators from 100 to 150 to improve decentralization.',
    proposer: 'cosmos1abcdef...',
    type: 'ParameterChange',
    status: 'Passed',
    submitTime: '2023-01-10T12:00:00Z',
    depositEndTime: '2023-01-17T12:00:00Z',
    votingStartTime: '2023-01-17T12:00:00Z',
    votingEndTime: '2023-01-31T12:00:00Z',
    totalDeposit: 15000,
    votes: {
      yes: 75,
      no: 10,
      noWithVeto: 5,
      abstain: 10,
    },
  },
  {
    id: 2,
    title: 'Community Pool Spend',
    description: 'Proposal to allocate 10,000 MYC from the community pool for developer grants.',
    proposer: 'cosmos1ghijkl...',
    type: 'CommunityPoolSpend',
    status: 'Voting',
    submitTime: '2023-02-15T09:30:00Z',
    depositEndTime: '2023-02-22T09:30:00Z',
    votingStartTime: '2023-02-22T09:30:00Z',
    votingEndTime: '2023-03-08T09:30:00Z',
    totalDeposit: 12500,
    votes: {
      yes: 48,
      no: 22,
      noWithVeto: 8,
      abstain: 12,
    },
  },
  {
    id: 3,
    title: 'Enable New Module',
    description: 'Proposal to enable the NFT module on the chain.',
    proposer: 'cosmos1mnopqr...',
    type: 'SoftwareUpgrade',
    status: 'Deposit',
    submitTime: '2023-03-01T15:45:00Z',
    depositEndTime: '2023-03-08T15:45:00Z',
    votingStartTime: '',
    votingEndTime: '',
    totalDeposit: 5000,
    votes: {
      yes: 0,
      no: 0,
      noWithVeto: 0,
      abstain: 0,
    },
  },
];
EOL

# Initialize backend with Node.js, Express, and dependencies
echo "Setting up backend..."
cd ../backend
npm init -y
npm install express cors helmet morgan mongoose jsonwebtoken bcryptjs dotenv
npm install js-yaml axios
npm install -D nodemon typescript @types/node @types/express @types/cors @types/morgan @types/mongoose @types/jsonwebtoken @types/bcryptjs

# Create tsconfig.json for TypeScript configuration
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
EOL

# Add start script to package.json
cat > package.json << 'EOL'
{
  "name": "cosmos-deploy-platform-backend",
  "version": "1.0.0",
  "description": "Backend for Cosmos Deploy Platform",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "cosmos",
    "blockchain",
    "deploy",
    "platform"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.3.4",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "helmet": "^6.0.1",
    "js-yaml": "^4.1.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.3",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/mongoose": "^5.11.97",
    "@types/morgan": "^1.9.4",
    "@types/node": "^18.15.11",
    "nodemon": "^2.0.22",
    "typescript": "^5.0.3"
  }
}
EOL

# Create .env file
cat > .env << 'EOL'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cosmos-deploy
JWT_SECRET=cosmos-deploy-platform-jwt-secret
EOL

# Create infrastructure directories for docker, kubernetes, and terraform templates
cd ../infrastructure
mkdir -p docker/{images,compose} kubernetes/{manifests,charts} terraform/{modules,environments} ansible/{playbooks,roles}

# Create placeholder README files
cd ../docs
cat > README.md << 'EOL'
# Cosmos Deploy Platform Documentation

This directory contains documentation for the Cosmos Deploy Platform.

## Contents

- **User Guides**: Documentation for end-users of the platform
- **Developer Guides**: Documentation for developers integrating with the platform
- **API Docs**: API reference documentation
- **Architecture**: System design documents

## Getting Started

Please refer to the user guides for information on how to use the platform.
EOL

# Return to the main directory
cd ../..

# Make the scripts executable
chmod +x setup-cosmos-deploy-platform.sh
chmod +x cosmos-deploy-platform-run.sh

echo "==== Setup Completed Successfully ===="
echo "To run the application, execute:"
echo "./cosmos-deploy-platform-run.sh"