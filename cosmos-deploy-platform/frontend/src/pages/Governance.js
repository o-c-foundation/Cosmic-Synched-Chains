import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Alert,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { useNetworks } from '../context/NetworkContext';
import { useNavigate } from 'react-router-dom';

// Import mock data if available
import { mockProposals } from '../utils/mockData';

const Governance = () => {
  const { networks, loading } = useNetworks();
  const navigate = useNavigate();
  const [allProposals, setAllProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch proposals from all networks
    // For now, we'll use mock data
    setTimeout(() => {
      setAllProposals(mockProposals || []);
      setProposalsLoading(false);
    }, 1000);
  }, []);

  // Get chip color based on proposal status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Passed':
        return 'success';
      case 'Rejected':
      case 'Failed':
        return 'error';
      case 'Voting':
        return 'primary';
      case 'Deposit':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading || proposalsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Governance
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Alert severity="info">
          This is the global governance page for all networks. For individual network governance, 
          please visit the specific network's details page and navigate to the Governance tab.
        </Alert>
        
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          From this page, you can track governance proposals across all your networks.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Recent Proposals
      </Typography>

      {allProposals.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Network</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.id}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {proposal.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                      Proposer: {proposal.proposer}
                    </Typography>
                  </TableCell>
                  <TableCell>{proposal.type}</TableCell>
                  <TableCell>
                    <Chip 
                      label={proposal.status} 
                      color={getStatusColor(proposal.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    MyCosmosChain
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate('/networks/1')}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No proposals found across your networks.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Governance;