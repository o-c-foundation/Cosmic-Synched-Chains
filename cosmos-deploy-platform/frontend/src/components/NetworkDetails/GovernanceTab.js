import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Tabs, 
  Tab,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { useNetworks } from '../../context/NetworkContext';

// Mock proposals if network doesn't have any
const mockProposals = [
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
  }
];

const GovernanceTab = ({ network }) => {
  const [tabValue, setTabValue] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  
  // Form state for creating a new proposal
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ParameterChange',
    deposit: 10000
  });
  
  // Vote state
  const [vote, setVote] = useState('yes');
  
  // Load proposals on mount
  useEffect(() => {
    // Use mock proposals for development
    setProposals(mockProposals);
  }, [network]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle opening proposal dialog
  const handleCreateProposal = () => {
    setDialogOpen(true);
  };
  
  // Handle opening vote dialog
  const handleVote = (proposal) => {
    setSelectedProposal(proposal);
    setVoteDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'deposit' ? Number(value) : value
    });
  };
  
  // Handle creating a new proposal
  const handleSubmitProposal = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API
      const newProposal = {
        id: proposals.length + 1,
        title: formData.title,
        description: formData.description,
        proposer: 'cosmos1current...',
        type: formData.type,
        status: 'Deposit',
        submitTime: new Date().toISOString(),
        depositEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        votingStartTime: '',
        votingEndTime: '',
        totalDeposit: formData.deposit,
        votes: {
          yes: 0,
          no: 0,
          noWithVeto: 0,
          abstain: 0
        }
      };
      
      setProposals([...proposals, newProposal]);
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        type: 'ParameterChange',
        deposit: 10000
      });
    } catch (err) {
      setError(err.message || 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle submitting a vote
  const handleSubmitVote = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would call an API
      // For now, just update the local state
      const updatedProposals = proposals.map(p => {
        if (p.id === selectedProposal.id) {
          const updatedVotes = { ...p.votes };
          updatedVotes[vote] += 1;
          return { ...p, votes: updatedVotes };
        }
        return p;
      });
      
      setProposals(updatedProposals);
      setVoteDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };
  
  // Get status chip color
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
  
  // Filter proposals based on selected tab
  const filteredProposals = proposals.filter(p => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return p.status === 'Voting'; // Active
    if (tabValue === 2) return p.status === 'Deposit'; // Deposit
    if (tabValue === 3) return ['Passed', 'Rejected', 'Failed'].includes(p.status); // Completed
    return true;
  });
  
  // Calculate vote percentages
  const calculateVotePercentages = (votes) => {
    const total = votes.yes + votes.no + votes.noWithVeto + votes.abstain;
    if (total === 0) return { yes: 0, no: 0, noWithVeto: 0, abstain: 0 };
    
    return {
      yes: (votes.yes / total) * 100,
      no: (votes.no / total) * 100,
      noWithVeto: (votes.noWithVeto / total) * 100,
      abstain: (votes.abstain / total) * 100
    };
  };
  
  // Check if the network is active
  const isActive = network.status === 'Active';
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Governance
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleCreateProposal}
          disabled={!isActive}
        >
          Create Proposal
        </Button>
      </Box>
      
      {!isActive && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Governance features are only available when the network is active. 
          {network.status === 'Created' ? ' Deploy the network first.' : 
           ` Current status: ${network.status}`}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Proposals" />
          <Tab label="Voting" />
          <Tab label="Deposit" />
          <Tab label="Completed" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredProposals.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Voting End</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProposals.map((proposal) => (
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
                    {proposal.votingEndTime ? 
                      new Date(proposal.votingEndTime).toLocaleDateString() : 
                      'Not started'}
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<HowToVoteIcon />}
                      onClick={() => handleVote(proposal)}
                      disabled={!isActive || proposal.status !== 'Voting'}
                    >
                      Vote
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
            No proposals found in this category.
          </Typography>
        </Paper>
      )}
      
      {/* Create Proposal Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Create New Proposal
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={4}
            />
            
            <FormControl fullWidth>
              <InputLabel>Proposal Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Proposal Type"
                onChange={handleInputChange}
              >
                <MenuItem value="ParameterChange">Parameter Change</MenuItem>
                <MenuItem value="CommunityPoolSpend">Community Pool Spend</MenuItem>
                <MenuItem value="SoftwareUpgrade">Software Upgrade</MenuItem>
                <MenuItem value="TextProposal">Text Proposal</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Deposit"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ 
                endAdornment: network.tokenEconomics.symbol
              }}
              helperText={`Minimum deposit: 10,000 ${network.tokenEconomics.symbol}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmitProposal}
            disabled={loading || !formData.title || !formData.description}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Proposal'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Vote Dialog */}
      {selectedProposal && (
        <Dialog 
          open={voteDialogOpen} 
          onClose={() => setVoteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Vote on Proposal #{selectedProposal.id}
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {selectedProposal.title}
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedProposal.description}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Voting Results
              </Typography>
              <Box sx={{ mb: 2 }}>
                {Object.entries(calculateVotePercentages(selectedProposal.votes)).map(([type, percentage]) => (
                  <Box key={type} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Typography>
                      <Typography variant="body2">
                        {percentage.toFixed(1)}% ({selectedProposal.votes[type]} votes)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      color={
                        type === 'yes' ? "success" : 
                        type === 'no' ? "error" : 
                        type === 'noWithVeto' ? "error" : 
                        "warning"
                      }
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Your Vote</InputLabel>
              <Select
                value={vote}
                label="Your Vote"
                onChange={(e) => setVote(e.target.value)}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="noWithVeto">No With Veto</MenuItem>
                <MenuItem value="abstain">Abstain</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubmitVote}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Vote'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default GovernanceTab;