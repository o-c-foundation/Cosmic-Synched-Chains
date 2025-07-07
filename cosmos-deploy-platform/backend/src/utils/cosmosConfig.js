/**
 * Cosmos Config Utility
 * 
 * Provides functions for generating and managing Cosmos blockchain configuration
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Generate genesis configuration for a new blockchain network
 * @param {Object} network - Network configuration
 * @returns {Object} - Genesis configuration
 */
exports.generateGenesisConfig = (network) => {
  try {
    // Default values
    const defaultChainParams = {
      bond_denom: network.tokenEconomics.symbol.toLowerCase(),
      unbonding_time: `${network.validatorRequirements.unbondingPeriod * 24}h0m0s`,
      max_validators: network.validatorRequirements.maxValidators || 100,
      voting_period: `${network.governanceSettings.votingPeriod * 24}h0m0s`,
      quorum: network.governanceSettings.quorum.toString(),
      threshold: network.governanceSettings.threshold.toString(),
      veto_threshold: network.governanceSettings.vetoThreshold.toString(),
    };
    
    // Initial token distribution
    const initialSupply = network.tokenEconomics.initialSupply;
    const distribution = network.tokenEconomics.distribution;
    
    const validatorTokens = Math.floor(initialSupply * distribution.validators / 100);
    const communityTokens = Math.floor(initialSupply * distribution.community / 100);
    const foundationTokens = Math.floor(initialSupply * distribution.foundation / 100);
    const airdropTokens = Math.floor(initialSupply * distribution.airdrop / 100);
    
    // Convert to the smallest unit (based on decimals)
    const decimalMultiplier = Math.pow(10, network.tokenEconomics.decimals);
    
    // Genesis structure
    const genesis = {
      genesis_time: new Date().toISOString(),
      chain_id: network.chainId,
      initial_height: "1",
      consensus_params: {
        block: {
          max_bytes: "22020096",
          max_gas: "-1",
          time_iota_ms: "1000"
        },
        evidence: {
          max_age_num_blocks: "100000",
          max_age_duration: "172800000000000",
          max_bytes: "1048576"
        },
        validator: {
          pub_key_types: ["ed25519"]
        },
        version: {}
      },
      app_hash: "",
      app_state: {
        auth: {
          params: {
            max_memo_characters: "256",
            tx_sig_limit: "7",
            tx_size_cost_per_byte: "10",
            sig_verify_cost_ed25519: "590",
            sig_verify_cost_secp256k1: "1000"
          },
          accounts: [
            // Foundation account
            {
              "@type": "/cosmos.auth.v1beta1.BaseAccount",
              address: "cosmos1foundation",
              pub_key: null,
              account_number: "0",
              sequence: "0"
            },
            // Community pool account
            {
              "@type": "/cosmos.auth.v1beta1.BaseAccount",
              address: "cosmos1community",
              pub_key: null,
              account_number: "1",
              sequence: "0"
            }
          ]
        },
        bank: {
          params: {
            send_enabled: [],
            default_send_enabled: true
          },
          balances: [
            {
              address: "cosmos1foundation",
              coins: [
                {
                  denom: network.tokenEconomics.symbol.toLowerCase(),
                  amount: (foundationTokens * decimalMultiplier).toString()
                }
              ]
            },
            {
              address: "cosmos1community",
              coins: [
                {
                  denom: network.tokenEconomics.symbol.toLowerCase(),
                  amount: (communityTokens * decimalMultiplier).toString()
                }
              ]
            }
          ],
          supply: [
            {
              denom: network.tokenEconomics.symbol.toLowerCase(),
              amount: ((foundationTokens + communityTokens) * decimalMultiplier).toString()
            }
          ],
          denom_metadata: [
            {
              description: network.description || `Token for ${network.name}`,
              denom_units: [
                {
                  denom: network.tokenEconomics.symbol.toLowerCase(),
                  exponent: 0,
                  aliases: []
                },
                {
                  denom: network.tokenEconomics.symbol,
                  exponent: network.tokenEconomics.decimals,
                  aliases: []
                }
              ],
              base: network.tokenEconomics.symbol.toLowerCase(),
              display: network.tokenEconomics.symbol,
              name: network.tokenEconomics.name,
              symbol: network.tokenEconomics.symbol
            }
          ]
        },
        capability: {
          index: "1",
          owners: []
        },
        crisis: {
          constant_fee: {
            denom: network.tokenEconomics.symbol.toLowerCase(),
            amount: "1000"
          }
        },
        distribution: {
          params: {
            community_tax: "0.02",
            base_proposer_reward: "0.01",
            bonus_proposer_reward: "0.04",
            withdraw_addr_enabled: true
          },
          fee_pool: {
            community_pool: []
          },
          delegator_withdraw_infos: [],
          previous_proposer: "",
          outstanding_rewards: [],
          validator_accumulated_commissions: [],
          validator_historical_rewards: [],
          validator_current_rewards: [],
          delegator_starting_infos: [],
          validator_slash_events: []
        },
        evidence: {
          evidence: []
        },
        genutil: {
          gen_txs: []
        },
        gov: {
          starting_proposal_id: "1",
          deposits: [],
          votes: [],
          proposals: [],
          deposit_params: {
            min_deposit: [
              {
                denom: network.tokenEconomics.symbol.toLowerCase(),
                amount: "10000000"
              }
            ],
            max_deposit_period: "172800s"
          },
          voting_params: {
            voting_period: defaultChainParams.voting_period
          },
          tally_params: {
            quorum: defaultChainParams.quorum,
            threshold: defaultChainParams.threshold,
            veto_threshold: defaultChainParams.veto_threshold
          }
        },
        mint: {
          minter: {
            inflation: "0.13",
            annual_provisions: "0"
          },
          params: {
            mint_denom: network.tokenEconomics.symbol.toLowerCase(),
            inflation_rate_change: "0.13",
            inflation_max: "0.20",
            inflation_min: "0.07",
            goal_bonded: "0.67",
            blocks_per_year: "6311520"
          }
        },
        params: null,
        slashing: {
          params: {
            signed_blocks_window: "100",
            min_signed_per_window: "0.500000000000000000",
            downtime_jail_duration: "600s",
            slash_fraction_double_sign: "0.050000000000000000",
            slash_fraction_downtime: "0.010000000000000000"
          },
          signing_infos: [],
          missed_blocks: []
        },
        staking: {
          params: {
            unbonding_time: defaultChainParams.unbonding_time,
            max_validators: defaultChainParams.max_validators,
            max_entries: 7,
            historical_entries: 10000,
            bond_denom: defaultChainParams.bond_denom
          },
          last_total_power: "0",
          last_validator_powers: [],
          validators: [],
          delegations: [],
          unbonding_delegations: [],
          redelegations: [],
          exported: false
        },
        transfer: {
          port_id: "transfer",
          denom_traces: [],
          params: {
            send_enabled: true,
            receive_enabled: true
          }
        },
        upgrade: {},
        vesting: {}
      }
    };
    
    // Enable modules based on network configuration
    network.modules.forEach(module => {
      if (module.enabled) {
        switch (module.id) {
          case 'wasm':
            genesis.app_state.wasm = {
              params: {
                code_upload_access: {
                  permission: "Everybody",
                  address: ""
                },
                instantiate_default_permission: "Everybody"
              },
              codes: [],
              contracts: []
            };
            break;
          // Add other modules as needed
        }
      }
    });
    
    return genesis;
  } catch (error) {
    console.error('Error generating genesis config:', error);
    throw error;
  }
};

/**
 * Generate node configuration updates
 * @param {Object} network - Network configuration
 * @returns {Object} - Configuration updates
 */
exports.generateConfigUpdates = (network) => {
  try {
    // Generate updates for config.toml
    const configToml = `
# This is a TOML config file for Cosmos nodes

[rpc]
laddr = "tcp://0.0.0.0:26657"

[p2p]
laddr = "tcp://0.0.0.0:26656"
seeds = ""
persistent_peers = ""

[mempool]
size = ${network.modules.find(m => m.id === 'mempool')?.config?.size || 5000}
max_tx_bytes = ${network.modules.find(m => m.id === 'mempool')?.config?.max_tx_bytes || 1048576}

[consensus]
timeout_propose = "${network.modules.find(m => m.id === 'consensus')?.config?.timeout_propose || '3s'}"
timeout_prevote = "${network.modules.find(m => m.id === 'consensus')?.config?.timeout_prevote || '1s'}"
timeout_precommit = "${network.modules.find(m => m.id === 'consensus')?.config?.timeout_precommit || '1s'}"
timeout_commit = "${network.modules.find(m => m.id === 'consensus')?.config?.timeout_commit || '5s'}"

[tx_index]
indexer = "kv"

[instrumentation]
prometheus = true
prometheus_listen_addr = ":9090"
`;

    // Generate updates for app.toml
    const appToml = `
# This is a TOML config file for Cosmos applications

[api]
enable = true
address = "tcp://0.0.0.0:1317"

[grpc]
enable = true
address = "0.0.0.0:9090"

[telemetry]
enable = true
prometheus-retention-time = 60

[state-sync]
snapshot-interval = ${network.modules.find(m => m.id === 'state-sync')?.config?.snapshot_interval || 1000}
snapshot-keep-recent = ${network.modules.find(m => m.id === 'state-sync')?.config?.snapshot_keep_recent || 10}
`;

    // Get updated genesis
    const genesis = exports.generateGenesisConfig(network);
    
    return {
      config: configToml,
      app: appToml,
      genesis
    };
  } catch (error) {
    console.error('Error generating config updates:', error);
    throw error;
  }
};

/**
 * Initialize a new blockchain node
 * @param {Object} network - Network configuration
 * @param {string} nodeHome - Node home directory
 * @returns {Promise<boolean>} - Success status
 */
exports.initNode = async (network, nodeHome) => {
  try {
    // Create node home directory if it doesn't exist
    if (!fs.existsSync(nodeHome)) {
      fs.mkdirSync(nodeHome, { recursive: true });
    }
    
    // Initialize node using Cosmos SDK
    const initCommand = `cosmos-sdk init --chain-id=${network.chainId} --home=${nodeHome}`;
    await execPromise(initCommand);
    
    // Generate genesis config
    const genesis = exports.generateGenesisConfig(network);
    
    // Write genesis to file
    fs.writeFileSync(
      path.join(nodeHome, 'config', 'genesis.json'),
      JSON.stringify(genesis, null, 2)
    );
    
    // Generate config updates
    const configUpdates = exports.generateConfigUpdates(network);
    
    // Write config.toml
    fs.writeFileSync(
      path.join(nodeHome, 'config', 'config.toml'),
      configUpdates.config
    );
    
    // Write app.toml
    fs.writeFileSync(
      path.join(nodeHome, 'config', 'app.toml'),
      configUpdates.app
    );
    
    return true;
  } catch (error) {
    console.error('Error initializing blockchain node:', error);
    return false;
  }
};

/**
 * Generate validator keys
 * @param {string} nodeHome - Node home directory
 * @param {string} moniker - Validator moniker
 * @returns {Promise<Object>} - Validator keys
 */
exports.generateValidatorKeys = async (nodeHome, moniker) => {
  try {
    // Create keys directory if it doesn't exist
    const keysDir = path.join(nodeHome, 'keys');
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
    }
    
    // Generate validator keys
    const keyCommand = `cosmos-sdk keys add validator --keyring-backend=test --home=${nodeHome}`;
    const { stdout } = await execPromise(keyCommand);
    
    // Parse key output
    const address = stdout.match(/address: ([a-z0-9]+)/i)?.[1];
    const pubKey = stdout.match(/pubkey: ([a-z0-9]+)/i)?.[1];
    
    return {
      address,
      pubKey,
      moniker,
      keyFile: path.join(keysDir, 'validator.json')
    };
  } catch (error) {
    console.error('Error generating validator keys:', error);
    throw error;
  }
};

/**
 * Create genesis transaction for validator
 * @param {Object} network - Network configuration
 * @param {string} nodeHome - Node home directory
 * @param {string} validatorAddress - Validator address
 * @param {string} moniker - Validator moniker
 * @returns {Promise<Object>} - Genesis transaction
 */
exports.createGenesisTx = async (network, nodeHome, validatorAddress, moniker) => {
  try {
    // Calculate stake amount
    const decimalMultiplier = Math.pow(10, network.tokenEconomics.decimals);
    const stakeAmount = 1000 * decimalMultiplier; // Initial validator stake
    
    // Create genesis transaction
    const genTxCommand = `cosmos-sdk gentx validator ${stakeAmount}${network.tokenEconomics.symbol.toLowerCase()} \
      --chain-id=${network.chainId} \
      --moniker="${moniker}" \
      --commission-rate=0.1 \
      --commission-max-rate=0.2 \
      --commission-max-change-rate=0.01 \
      --keyring-backend=test \
      --home=${nodeHome}`;
    
    const { stdout } = await execPromise(genTxCommand);
    
    // Get transaction file path
    const txFilePath = path.join(nodeHome, 'config', 'gentx', `gentx-${validatorAddress}.json`);
    
    return {
      txFile: txFilePath,
      validatorAddress
    };
  } catch (error) {
    console.error('Error creating genesis transaction:', error);
    throw error;
  }
};

/**
 * Collect genesis transactions and finalize genesis
 * @param {Object} network - Network configuration
 * @param {string} nodeHome - Node home directory
 * @returns {Promise<boolean>} - Success status
 */
exports.finalizeGenesis = async (network, nodeHome) => {
  try {
    // Collect genesis transactions
    const collectCommand = `cosmos-sdk collect-gentxs --home=${nodeHome}`;
    await execPromise(collectCommand);
    
    // Validate genesis
    const validateCommand = `cosmos-sdk validate-genesis --home=${nodeHome}`;
    await execPromise(validateCommand);
    
    return true;
  } catch (error) {
    console.error('Error finalizing genesis:', error);
    return false;
  }
};

/**
 * Export genesis file from a running node
 * @param {string} rpcEndpoint - RPC endpoint of the node
 * @param {string} outputPath - Output file path
 * @returns {Promise<boolean>} - Success status
 */
exports.exportGenesis = async (rpcEndpoint, outputPath) => {
  try {
    // Export genesis from a running node
    const exportCommand = `curl -s ${rpcEndpoint}/genesis | jq '.result.genesis' > ${outputPath}`;
    await execPromise(exportCommand);
    
    return true;
  } catch (error) {
    console.error('Error exporting genesis:', error);
    return false;
  }
};

/**
 * Validate genesis file
 * @param {string} genesisPath - Path to genesis file
 * @returns {Promise<Object>} - Validation result
 */
exports.validateGenesis = async (genesisPath) => {
  try {
    // Validate genesis file
    const validateCommand = `cosmos-sdk validate-genesis ${genesisPath}`;
    const { stdout, stderr } = await execPromise(validateCommand);
    
    return {
      valid: !stderr,
      output: stdout,
      error: stderr
    };
  } catch (error) {
    console.error('Error validating genesis:', error);
    return {
      valid: false,
      output: '',
      error: error.message
    };
  }
};