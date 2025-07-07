import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { Network, Proposal } from '../../types/network';
import { mockProposals } from '../../utils/mockData';

interface GovernanceTabProps {
  network: Network;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`governance-tabpanel-${index}`}
      aria-labelledby={`governance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const GovernanceTab: React.FC<GovernanceTabProps> = ({ network }) => {
  const [tabValue, setTabValue] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [createProposalOpen, setCreateProposalOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  
  // New proposal form state
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    type: 'ParameterChange'
  });
  
  // Vote state
  const [voteOption, setVoteOption] = useState('');
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleCreateProposal = () => {
    setCreateProposalOpen(true);
  };
  
  const handleVoteDialogOpen = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setVoteDialogOpen(true);
  };
  
  const handleProposalFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    
    setProposalForm({
      ...proposalForm,
      [name]: value
    });
  };
  
  const handleVoteOptionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setVoteOption(e.target.value as string);
  };
  
  const handleSubmitProposal = () => {
    // In a real app, this would submit to the blockchain
    const newProposal: Proposal = {
      id: proposals.length + 1,
      title: proposalForm.title,
      description: proposalForm.description,
      type: proposalForm.type,
      proposer: 'cosmos1abcdef...', // Would be the user's address
      status: 'Deposit',
      submitTime: new Date().toISOString(),
      depositEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      votingStartTime: '',
      votingEndTime: '',
      totalDeposit: 0,
      votes: {
        yes: 0,
        no: 0,
        noWithVeto: 0,
        abstain: 0
      }
    };
    
    setProposals([...proposals, newProposal]);
    setCreateProposalOpen(false);
    setProposalForm({
      title: '',
      description: '',
      type: 'ParameterChange'
    });
  };
  
  const handleSubmitVote = () => {
    // In a real app, this would submit the vote to the blockchain
    if (!selectedProposal || !voteOption) return;
    
    // Update the mock vote counts
    const updatedProposals = proposals.map(proposal => {
      if (proposal.id === selectedProposal.id) {
        const updatedVotes = { ...proposal.votes };
        
        // Add a vote (in a real app this would be weighted by stake)
        switch (voteOption) {
          case 'yes':
            updatedVotes.yes += 5;
            break;
          case 'no':
            updatedVotes.no += 5;
            break;
          case 'noWithVeto':
            updatedVotes.noWithVeto += 5;
            break;
          case 'abstain':
            updatedVotes.abstain += 5;
            break;
        }
        
        return {
          ...proposal,
          votes: updatedVotes
        };
      }
      return proposal;
    });
    
    setProposals(updatedProposals);
    setVoteDialogOpen(false);
    setVoteOption('');
  };
  
  // Status chip color mapping
  const getStatusColor = (status: string) => {
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
  
  // Calculate total votes
  const calculateTotalVotes = (proposal: Proposal): number => {
    return proposal.votes.yes + proposal.votes.no + proposal.votes.noWithVeto + proposal.votes.abstain;
  };
  
  // Calculate vote percentages
  const calculateVotePercentage = (voteCount: number, totalVotes: number): number => {
    if (totalVotes === 0) return 0;
    return (voteCount / totalVotes) * 100;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Governance
        </Typography>
        
        {network.status === 'Active' && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCreateProposal}
          >
            Create Proposal
          </Button>
        )}
      </Box>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="governance tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Proposals" />
          <Tab label="Voting Period" />
          <Tab label="Deposit Period" />
          <Tab label="Passed" />
          <Tab label="Rejected" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <ProposalsList 
            proposals={proposals} 
            network={network} 
            handleVoteDialogOpen={handleVoteDialogOpen}
            calculateTotalVotes={calculateTotalVotes}
            calculateVotePercentage={calculateVotePercentage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <ProposalsList 
            proposals={proposals.filter(p => p.status === 'Voting')} 
            network={network} 
            handleVoteDialogOpen={handleVoteDialogOpen}
            calculateTotalVotes={calculateTotalVotes}
            calculateVotePercentage={calculateVotePercentage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <ProposalsList 
            proposals={proposals.filter(p => p.status === 'Deposit')} 
            network={network} 
            handleVoteDialogOpen={handleVoteDialogOpen}
            calculateTotalVotes={calculateTotalVotes}
            calculateVotePercentage={calculateVotePercentage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <ProposalsList 
            proposals={proposals.filter(p => p.status === 'Passed')} 
            network={network} 
            handleVoteDialogOpen={handleVoteDialogOpen}
            calculateTotalVotes={calculateTotalVotes}
            calculateVotePercentage={calculateVotePercentage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <ProposalsList 
            proposals={proposals.filter(p => p.status === 'Rejected' || p.status === 'Failed')} 
            network={network} 
            handleVoteDialogOpen={handleVoteDialogOpen}
            calculateTotalVotes={calculateTotalVotes}
            calculateVotePercentage={calculateVotePercentage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
      </Paper>
      
      {/* Create Proposal Dialog */}
      <Dialog 
        open={createProposalOpen} 
        onClose={() => setCreateProposalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Proposal</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Create a new governance proposal for the network. Proposals require a deposit
            of {network.modules.find(m => m.id === 'gov')?.config.minDeposit || 10000} {network.tokenEconomics.symbol} to enter voting period.
          </DialogContentText>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={proposalForm.title}
                onChange={handleProposalFormChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={proposalForm.description}
                onChange={handleProposalFormChange}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="proposal-type-label">Proposal Type</InputLabel>
                <Select
                  labelId="proposal-type-label"
                  name="type"
                  value={proposalForm.type}
                  onChange={handleProposalFormChange}
                  label="Proposal Type"
                >
                  <MenuItem value="ParameterChange">Parameter Change</MenuItem>
                  <MenuItem value="CommunityPoolSpend">Community Pool Spend</MenuItem>
                  <MenuItem value="SoftwareUpgrade">Software Upgrade</MenuItem>
                  <MenuItem value="TextProposal">Text Proposal</MenuItem>
                </Select>
                <FormHelperText>The type of proposal determines what actions will be taken if passed</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateProposalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitProposal} 
            variant="contained"
            disabled={!proposalForm.title || !proposalForm.description}
          >
            Submit Proposal
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Vote Dialog */}
      <Dialog 
        open={voteDialogOpen} 
        onClose={() => setVoteDialogOpen(false)}
      >
        <DialogTitle>Vote on Proposal</DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <>
              <DialogContentText paragraph>
                <strong>{selectedProposal.title}</strong>
              </DialogContentText>
              <DialogContentText paragraph>
                You are voting on proposal #{selectedProposal.id}. Please select your vote option:
              </DialogContentText>
              
              <FormControl fullWidth required sx={{ mt: 2 }}>
                <InputLabel id="vote-option-label">Vote Option</InputLabel>
                <Select
                  labelId="vote-option-label"
                  value={voteOption}
                  onChange={handleVoteOptionChange}
                  label="Vote Option"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="noWithVeto">No With Veto</MenuItem>
                  <MenuItem value="abstain">Abstain</MenuItem>
                </Select>
                <FormHelperText>
                  {voteOption === 'yes' && 'Vote in favor of the proposal'}
                  {voteOption === 'no' && 'Vote against the proposal'}
                  {voteOption === 'noWithVeto' && 'Vote against and penalize deposit stakers'}
                  {voteOption === 'abstain' && 'Abstain from voting (counts for quorum)'}
                </FormHelperText>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVoteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitVote} 
            variant="contained"
            disabled={!voteOption}
          >
            Submit Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Separate component for proposals list
interface ProposalsListProps {
  proposals: Proposal[];
  network: Network;
  handleVoteDialogOpen: (proposal: Proposal) => void;
  calculateTotalVotes: (proposal: Proposal) => number;
  calculateVotePercentage: (voteCount: number, totalVotes: number) => number;
  getStatusColor: (status: string) => string;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ 
  proposals, 
  network, 
  handleVoteDialogOpen,
  calculateTotalVotes,
  calculateVotePercentage,
  getStatusColor
}) => {
  if (proposals.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No proposals found
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Voting</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proposals.map((proposal) => {
            const totalVotes = calculateTotalVotes(proposal);
            
            return (
              <TableRow key={proposal.id}>
                <TableCell>{proposal.id}</TableCell>
                <TableCell>
                  <Typography variant="body2">{proposal.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Submitted: {new Date(proposal.submitTime).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>{proposal.type}</TableCell>
                <TableCell>
                  <Chip 
                    label={proposal.status} 
                    color={getStatusColor(proposal.status) as "success" | "default" | "primary" | "secondary" | "error" | "info" | "warning"} 
                    size="small" 
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  {proposal.status === 'Voting' || proposal.status === 'Passed' || proposal.status === 'Rejected' ? (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" color="success.main">
                          Yes: {proposal.votes.yes} ({calculateVotePercentage(proposal.votes.yes, totalVotes).toFixed(1)}%)
                        </Typography>
                        <Typography variant="caption" color="error.main">
                          No: {proposal.votes.no} ({calculateVotePercentage(proposal.votes.no, totalVotes).toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="buffer"
                        value={calculateVotePercentage(proposal.votes.yes, totalVotes)}
                        valueBuffer={100 - calculateVotePercentage(proposal.votes.noWithVeto, totalVotes)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Abstain: {calculateVotePercentage(proposal.votes.abstain, totalVotes).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Veto: {calculateVotePercentage(proposal.votes.noWithVeto, totalVotes).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ) : proposal.status === 'Deposit' ? (
                    <Box>
                      <Typography variant="body2">
                        {proposal.totalDeposit} / {network.modules.find(m => m.id === 'gov')?.config.minDeposit || 10000} {network.tokenEconomics.symbol}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(proposal.totalDeposit / (network.modules.find(m => m.id === 'gov')?.config.minDeposit || 10000)) * 100}
                        sx={{ mt: 1, height: 8, borderRadius: 1 }} 
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Not applicable</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {proposal.status === 'Voting' && network.status === 'Active' && (
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleVoteDialogOpen(proposal)}
                    >
                      Vote
                    </Button>
                  )}
                  {proposal.status === 'Deposit' && network.status === 'Active' && (
                    <Button 
                      size="small" 
                      variant="outlined"
                    >
                      Deposit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GovernanceTab;