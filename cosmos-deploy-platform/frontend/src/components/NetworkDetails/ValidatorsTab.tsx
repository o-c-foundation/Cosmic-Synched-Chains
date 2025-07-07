import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Network, Validator } from '../../types/network';
import { mockValidators } from '../../utils/mockData';

interface ValidatorsTabProps {
  network: Network;
}

const ValidatorsTab: React.FC<ValidatorsTabProps> = ({ network }) => {
  const [validators, setValidators] = useState<Validator[]>(mockValidators);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleValidatorSelect = (validator: Validator) => {
    setSelectedValidator(validator);
    setDetailsDialogOpen(true);
  };
  
  // Filter validators by search query
  const filteredValidators = validators.filter(validator => 
    validator.moniker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    validator.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    validator.identity.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Status chip color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Jailed':
        return 'error';
      case 'Tombstoned':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Format percentages
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };
  
  // Calculate total staked
  const totalStaked = validators.reduce((sum, validator) => sum + validator.stake, 0);
  
  // Calculate active validators count
  const activeValidators = validators.filter(v => v.status === 'Active').length;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Validators
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        View and manage validators for your blockchain network.
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Validators
              </Typography>
              <Typography variant="h4">
                {validators.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeValidators} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Staked
              </Typography>
              <Typography variant="h4">
                {totalStaked.toLocaleString()} {network.tokenEconomics.symbol}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatPercentage((totalStaked / network.tokenEconomics.initialSupply) * 100)} of supply
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Average Commission
              </Typography>
              <Typography variant="h4">
                {formatPercentage(validators.reduce((sum, v) => sum + v.commission, 0) / validators.length)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Average Uptime
              </Typography>
              <Typography variant="h4">
                {formatPercentage(validators.reduce((sum, v) => sum + v.uptime, 0) / validators.length)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search validators by name, address, or identity"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '50%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          {network.status === 'Active' && (
            <Button variant="contained" color="primary">
              Add Validator
            </Button>
          )}
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Validator</TableCell>
                <TableCell>Commission</TableCell>
                <TableCell>Stake</TableCell>
                <TableCell>Uptime</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredValidators.length > 0 ? (
                filteredValidators
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((validator) => (
                    <TableRow 
                      key={validator.address}
                      hover
                      onClick={() => handleValidatorSelect(validator)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32,
                              backgroundColor: `#${validator.identity.substring(0, 6)}`,
                              mr: 1
                            }}
                          >
                            {validator.moniker.substring(0, 1)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">{validator.moniker}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {`${validator.address.substring(0, 8)}...${validator.address.substring(validator.address.length - 8)}`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{formatPercentage(validator.commission)}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {validator.stake.toLocaleString()} {network.tokenEconomics.symbol}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(validator.stake / totalStaked) * 100} 
                            sx={{ mt: 1, height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{formatPercentage(validator.uptime)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={validator.status} 
                          color={getStatusColor(validator.status) as "success" | "default" | "primary" | "secondary" | "error" | "info" | "warning"} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleValidatorSelect(validator);
                          }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      {searchQuery ? 'No validators match your search' : 'No validators found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredValidators.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredValidators.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
      
      {/* Validator Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedValidator && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    backgroundColor: `#${selectedValidator.identity.substring(0, 6)}`,
                    mr: 2
                  }}
                >
                  {selectedValidator.moniker.substring(0, 1)}
                </Avatar>
                <Typography variant="h6">{selectedValidator.moniker}</Typography>
                <Chip 
                  label={selectedValidator.status} 
                  color={getStatusColor(selectedValidator.status) as "success" | "default" | "primary" | "secondary" | "error" | "info" | "warning"} 
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all', mt: 1 }}>
                    {selectedValidator.address}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Identity
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedValidator.identity}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Website
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <a href={selectedValidator.website} target="_blank" rel="noopener noreferrer">
                      {selectedValidator.website}
                    </a>
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Commission Rate
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {formatPercentage(selectedValidator.commission)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Stake
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedValidator.stake.toLocaleString()} {network.tokenEconomics.symbol}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Uptime
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {formatPercentage(selectedValidator.uptime)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedValidator.details}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedValidator.status === 'Jailed' && (
                <Button color="primary">Unjail</Button>
              )}
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ValidatorsTab;