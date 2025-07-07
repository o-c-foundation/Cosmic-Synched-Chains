import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useNetworks } from '../../context/NetworkContext';

// Mock log data for development
const generateMockLogs = (count = 100) => {
  const logLevels = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
  const components = ['consensus', 'mempool', 'p2p', 'statesync', 'blockchain', 'api', 'txindex', 'rpc'];
  const messages = [
    'Block committed at height 42',
    'Peer disconnected: tcp://nodeid@127.0.0.1:26656',
    'Executed block height=1234 validTxs=15 invalidTxs=0',
    'Committed state app_hash=... height=3456',
    'Timed out waiting for txs from mempool',
    'RPC HTTP server started on 0.0.0.0:26657',
    'Service stopped: consensus',
    'Indexed block height=1234 hash=...',
    'Received proposal height=7890 round=0',
    'Finalized commit of block hash=... height=9876',
    'Invalid transaction: invalid signature',
    'Failed to connect to peer: connection refused'
  ];
  
  const logs = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const logLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
    const component = components[Math.floor(Math.random() * components.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const time = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    const node = `validator-${Math.floor(Math.random() * 5) + 1}`;
    
    logs.push({
      id: i,
      timestamp: time.toISOString(),
      level: logLevel,
      component,
      message,
      node,
      module: component,
    });
  }
  
  // Sort by timestamp descending (newest first)
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const LogsTab = ({ network }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState(['ERROR', 'WARN', 'INFO']);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [startTime, setStartTime] = useState(new Date(Date.now() - 3600 * 1000)); // 1 hour ago
  const [endTime, setEndTime] = useState(new Date());
  
  // Get list of available nodes and modules for filter dropdowns
  const [availableNodes, setAvailableNodes] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  
  // Fetch logs initially and when filters change
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would fetch from API
        // For now, use mock data
        const fetchedLogs = generateMockLogs(300);
        setLogs(fetchedLogs);
        
        // Extract available nodes and modules for filters
        const nodes = [...new Set(fetchedLogs.map(log => log.node))];
        const modules = [...new Set(fetchedLogs.map(log => log.module))];
        
        setAvailableNodes(nodes);
        setAvailableModules(modules);
        
        // Apply filters
        applyFilters(fetchedLogs);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        setError('Failed to fetch logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
    
    // Setup auto-refresh if enabled
    let refreshTimer;
    if (autoRefresh) {
      refreshTimer = setInterval(fetchLogs, refreshInterval * 1000);
    }
    
    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [network.id, autoRefresh, refreshInterval]);
  
  // Apply filters when filter settings change
  useEffect(() => {
    applyFilters(logs);
  }, [searchQuery, selectedLevels, selectedNodes, selectedModules, startTime, endTime]);
  
  // Apply all filters to logs
  const applyFilters = (allLogs) => {
    let filtered = [...allLogs];
    
    // Filter by log level
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(log => selectedLevels.includes(log.level));
    }
    
    // Filter by node
    if (selectedNodes.length > 0) {
      filtered = filtered.filter(log => selectedNodes.includes(log.node));
    }
    
    // Filter by module
    if (selectedModules.length > 0) {
      filtered = filtered.filter(log => selectedModules.includes(log.module));
    }
    
    // Filter by time range
    filtered = filtered.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) || 
        log.component.toLowerCase().includes(query)
      );
    }
    
    setFilteredLogs(filtered);
    setPage(0); // Reset to first page when filters change
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Manual refresh
  const handleRefresh = () => {
    // Re-fetch logs
    setLoading(true);
    setTimeout(() => {
      setLogs(generateMockLogs(300));
      applyFilters(logs);
      setLoading(false);
    }, 500);
  };
  
  // Toggle auto-refresh
  const handleAutoRefreshChange = (event) => {
    setAutoRefresh(event.target.checked);
  };
  
  // Handle refresh interval change
  const handleRefreshIntervalChange = (event) => {
    setRefreshInterval(Number(event.target.value));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLevels(['ERROR', 'WARN', 'INFO']);
    setSelectedNodes([]);
    setSelectedModules([]);
    setStartTime(new Date(Date.now() - 3600 * 1000));
    setEndTime(new Date());
  };
  
  // Export logs
  const handleExportLogs = () => {
    // Create a CSV from filtered logs
    const headers = ['Timestamp', 'Level', 'Node', 'Module', 'Message'];
    const csvRows = [headers.join(',')];
    
    filteredLogs.forEach(log => {
      const row = [
        log.timestamp,
        log.level,
        log.node,
        log.module,
        `"${log.message.replace(/"/g, '""')}"`  // Escape quotes in CSV
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `network-${network.id}-logs-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get color for log level
  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return 'error';
      case 'WARN': return 'warning';
      case 'INFO': return 'info';
      case 'DEBUG': return 'default';
      default: return 'default';
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Check if the network is active
  const isActive = network.status === 'Active' || network.status === 'Degraded';
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Logs
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={handleAutoRefreshChange}
                color="primary"
              />
            }
            label="Auto-refresh"
          />
          
          {autoRefresh && (
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Interval</InputLabel>
              <Select
                value={refreshInterval}
                onChange={handleRefreshIntervalChange}
                label="Interval"
              >
                <MenuItem value={10}>10s</MenuItem>
                <MenuItem value={30}>30s</MenuItem>
                <MenuItem value={60}>1m</MenuItem>
                <MenuItem value={300}>5m</MenuItem>
              </Select>
            </FormControl>
          )}
          
          <Tooltip title="Refresh logs">
            <IconButton 
              onClick={handleRefresh} 
              color="primary"
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Export logs">
            <IconButton 
              onClick={handleExportLogs} 
              color="primary"
              disabled={loading || filteredLogs.length === 0}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={showFilters ? "Hide filters" : "Show filters"}>
            <IconButton 
              onClick={() => setShowFilters(!showFilters)} 
              color={showFilters ? "primary" : "default"}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {!isActive && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Full logs are only available for active networks. 
          {network.status === 'Created' ? ' Deploy the network to access logs.' : 
           ` Current status: ${network.status}`}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filters Panel */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <Button 
              startIcon={<ClearIcon />}
              onClick={handleResetFilters}
              size="small"
            >
              Reset
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {/* Search Box */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search logs"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: searchQuery ? (
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }}
              />
            </Grid>
            
            {/* Log Level Filter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Log Levels</InputLabel>
                <Select
                  multiple
                  value={selectedLevels}
                  onChange={(e) => setSelectedLevels(e.target.value)}
                  label="Log Levels"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small" 
                          color={getLevelColor(value)}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="ERROR">ERROR</MenuItem>
                  <MenuItem value="WARN">WARN</MenuItem>
                  <MenuItem value="INFO">INFO</MenuItem>
                  <MenuItem value="DEBUG">DEBUG</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Time Range Filters */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="From"
                  value={startTime}
                  onChange={setStartTime}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="To"
                  value={endTime}
                  onChange={setEndTime}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* Node Filter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Nodes</InputLabel>
                <Select
                  multiple
                  value={selectedNodes}
                  onChange={(e) => setSelectedNodes(e.target.value)}
                  label="Nodes"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableNodes.map((node) => (
                    <MenuItem key={node} value={node}>
                      {node}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Module Filter */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Modules</InputLabel>
                <Select
                  multiple
                  value={selectedModules}
                  onChange={(e) => setSelectedModules(e.target.value)}
                  label="Modules"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableModules.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Results */}
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredLogs.length > 0 ? (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Node</TableCell>
                    <TableCell>Module</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.level} 
                            size="small" 
                            color={getLevelColor(log.level)}
                          />
                        </TableCell>
                        <TableCell>{log.node}</TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell 
                          sx={{ 
                            maxWidth: '400px', 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                          }}
                        >
                          {log.message}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50, 100]}
              component="div"
              count={filteredLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No logs found matching the current filters.
            </Typography>
            {(selectedLevels.length < 4 || searchQuery || selectedNodes.length > 0 || selectedModules.length > 0) && (
              <Button 
                onClick={handleResetFilters}
                sx={{ mt: 2 }}
              >
                Reset Filters
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default LogsTab;