import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { Network } from '../../types/network';

interface LogsTabProps {
  network: Network;
}

// Log severity levels
type LogLevel = 'error' | 'warning' | 'info' | 'debug';

// Mock log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
}

// Generate mock log data
const generateMockLogs = (count: number): LogEntry[] => {
  const modules = ['consensus', 'mempool', 'p2p', 'state', 'txindex', 'evidence', 'rpc', 'blockchain'];
  const logLevels: LogLevel[] = ['error', 'warning', 'info', 'debug'];
  
  const errorMessages = [
    'Failed to connect to peer',
    'Transaction verification failed',
    'Block validation error',
    'RPC request timeout',
    'Database query error'
  ];
  
  const warningMessages = [
    'Node is falling behind',
    'High memory usage detected',
    'Peer connection unstable',
    'Transaction pool nearly full',
    'Slow block propagation'
  ];
  
  const infoMessages = [
    'New block created',
    'Transaction included in block',
    'Peer connected',
    'Validator updated',
    'Config reloaded'
  ];
  
  const debugMessages = [
    'Processing transaction',
    'Verifying signatures',
    'Executing state transition',
    'Calculating merkle root',
    'Updating validator set'
  ];
  
  const logs: LogEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    
    let message = '';
    switch (level) {
      case 'error':
        message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        break;
      case 'warning':
        message = warningMessages[Math.floor(Math.random() * warningMessages.length)];
        break;
      case 'info':
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
        break;
      case 'debug':
        message = debugMessages[Math.floor(Math.random() * debugMessages.length)];
        break;
    }
    
    // Generate a random date within the last 24 hours
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
    date.setSeconds(date.getSeconds() - Math.floor(Math.random() * 60));
    
    logs.push({
      timestamp: date.toISOString(),
      level,
      module,
      message
    });
  }
  
  // Sort by timestamp (newest first)
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return logs;
};

const LogsTab: React.FC<LogsTabProps> = ({ network }) => {
  const [logs, setLogs] = useState<LogEntry[]>(generateMockLogs(100));
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  
  // Filter state
  const [filters, setFilters] = useState({
    levels: {
      error: true,
      warning: true,
      info: true,
      debug: true
    },
    modules: {
      consensus: true,
      mempool: true,
      p2p: true,
      state: true,
      txindex: true,
      evidence: true,
      rpc: true,
      blockchain: true
    }
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle level filter change
  const handleLevelFilterChange = (level: LogLevel) => {
    setFilters({
      ...filters,
      levels: {
        ...filters.levels,
        [level]: !filters.levels[level]
      }
    });
  };
  
  // Handle module filter change
  const handleModuleFilterChange = (module: string) => {
    setFilters({
      ...filters,
      modules: {
        ...filters.modules,
        [module]: !filters.modules[module]
      }
    });
  };
  
  // Handle time range change
  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };
  
  // Refresh logs
  const handleRefresh = () => {
    setLogs(generateMockLogs(100));
  };
  
  // Export logs
  const handleExport = () => {
    // In a real app, this would generate a file download
    console.log('Exporting logs');
  };
  
  // Filter logs based on search query and filters
  const filteredLogs = logs.filter(log => {
    // Filter by search query
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !log.module.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by log level
    if (!filters.levels[log.level]) {
      return false;
    }
    
    // Filter by module
    if (!filters.modules[log.module]) {
      return false;
    }
    
    return true;
  });
  
  // Get log entry color
  const getLogColor = (level: LogLevel): string => {
    switch (level) {
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      case 'info':
        return 'info.main';
      case 'debug':
        return 'text.secondary';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Network Logs
      </Typography>
      
      {network.status !== 'Active' ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            Logs are only available for active networks. Deploy this network to view logs.
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search logs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, minWidth: '250px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
                size="small"
              >
                <MenuItem value="1h">Last hour</MenuItem>
                <MenuItem value="6h">Last 6 hours</MenuItem>
                <MenuItem value="24h">Last 24 hours</MenuItem>
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Box>
          
          {/* Filters panel */}
          {showFilters && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Filter Logs
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Log Levels
                  </Typography>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={filters.levels.error} 
                          onChange={() => handleLevelFilterChange('error')}
                          color="error"
                        />
                      }
                      label="Error"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={filters.levels.warning} 
                          onChange={() => handleLevelFilterChange('warning')}
                          color="warning"
                        />
                      }
                      label="Warning"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={filters.levels.info} 
                          onChange={() => handleLevelFilterChange('info')}
                          color="info"
                        />
                      }
                      label="Info"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={filters.levels.debug} 
                          onChange={() => handleLevelFilterChange('debug')}
                        />
                      }
                      label="Debug"
                    />
                  </FormGroup>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Modules
                  </Typography>
                  <FormGroup row>
                    {Object.keys(filters.modules).map(module => (
                      <FormControlLabel
                        key={module}
                        control={
                          <Checkbox 
                            checked={filters.modules[module as keyof typeof filters.modules]} 
                            onChange={() => handleModuleFilterChange(module)}
                          />
                        }
                        label={module}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Logs display */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ height: '500px', overflowY: 'auto' }}>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 1.5, 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: getLogColor(log.level),
                          textTransform: 'uppercase'
                        }}
                      >
                        {log.level}
                      </Typography>
                      <Typography variant="caption" fontWeight="medium">
                        [{log.module}]
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {log.message}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    No logs matching the current filters
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Showing {filteredLogs.length} of {logs.length} logs
              </Typography>
              
              <Button size="small" onClick={handleRefresh}>
                Load More
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default LogsTab;