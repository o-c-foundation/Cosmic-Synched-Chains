import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNetworks } from '../context/NetworkContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const NetworksList: React.FC = () => {
  const { networks, deleteNetwork, deployNetwork } = useNetworks();
  const navigate = useNavigate();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, networkId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNetworkId(networkId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNetworkId(null);
  };
  
  const handleViewDetails = () => {
    if (selectedNetworkId) {
      navigate(`/networks/${selectedNetworkId}`);
    }
    handleMenuClose();
  };
  
  const handleDeploy = () => {
    if (selectedNetworkId) {
      deployNetwork(selectedNetworkId, 'local');
    }
    handleMenuClose();
  };
  
  const handleDelete = () => {
    if (selectedNetworkId) {
      deleteNetwork(selectedNetworkId);
    }
    handleMenuClose();
  };
  
  // Filter networks by search query
  const filteredNetworks = networks.filter(network => 
    network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    network.chainId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    network.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Status chip color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Deploying':
      case 'Updating':
      case 'Restoring':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">My Networks</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-network')}
        >
          Create New Network
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search networks by name, chain ID, or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Chain ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Deployed Environment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNetworks.length > 0 ? (
                filteredNetworks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((network) => (
                    <TableRow 
                      key={network.id}
                      hover
                      onClick={() => navigate(`/networks/${network.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Typography variant="body1">{network.name}</Typography>
                      </TableCell>
                      <TableCell>{network.chainId}</TableCell>
                      <TableCell>
                        <Chip 
                          label={network.status} 
                          color={getStatusColor(network.status) as "success" | "default" | "primary" | "secondary" | "error" | "info" | "warning"} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(network.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {network.deployedEnvironment || 'Not deployed'}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, network.id);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      {searchQuery ? 'No networks match your search' : 'No networks created yet'}
                    </Typography>
                    {!searchQuery && (
                      <Button 
                        variant="outlined" 
                        onClick={() => navigate('/create-network')}
                        sx={{ mt: 1 }}
                      >
                        Create Your First Network
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredNetworks.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredNetworks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
        {networks.find(n => n.id === selectedNetworkId)?.status === 'Created' && (
          <MenuItem onClick={handleDeploy}>Deploy</MenuItem>
        )}
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default NetworksList;