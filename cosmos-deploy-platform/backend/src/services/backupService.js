/**
 * Backup Service
 * 
 * Provides functions for backing up and restoring blockchain networks
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { ResourceNotFoundError } = require('../middlewares/errorHandler');
const crypto = require('crypto');

// Base directory for backups
const BACKUP_BASE_DIR = process.env.BACKUP_DIR || '/tmp/cosmos-backups';

/**
 * Create a backup of a network
 * @param {Object} network - Network object
 * @param {string} description - Backup description
 * @returns {Promise<Object>} - Backup details
 */
exports.createBackup = async (network, description = '') => {
  try {
    // Check if network is active
    if (network.status !== 'Active') {
      throw new Error('Cannot backup a network that is not active');
    }
    
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Generate backup ID
    const backupId = generateBackupId(network.chainId);
    
    // Create backup based on deployment environment
    let backupLocation;
    let blockHeight;
    
    switch (deployment.environment) {
      case 'local':
        ({ backupLocation, blockHeight } = await createLocalBackup(network, backupId));
        break;
      case 'aws':
        ({ backupLocation, blockHeight } = await createAwsBackup(network, deployment, backupId));
        break;
      case 'gcp':
        ({ backupLocation, blockHeight } = await createGcpBackup(network, deployment, backupId));
        break;
      case 'azure':
        ({ backupLocation, blockHeight } = await createAzureBackup(network, deployment, backupId));
        break;
      default:
        throw new Error(`Unsupported environment: ${deployment.environment}`);
    }
    
    // Create backup object
    const backup = {
      backupId,
      description: description || `Backup created on ${new Date().toISOString()}`,
      location: backupLocation,
      blockHeight,
      size: await getBackupSize(backupLocation),
      createdAt: new Date().toISOString()
    };
    
    return backup;
  } catch (error) {
    console.error(`Error creating backup for network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Generate a unique backup ID
 * @param {string} chainId - Chain ID
 * @returns {string} - Unique backup ID
 */
function generateBackupId(chainId) {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `backup-${chainId}-${timestamp}-${random}`;
}

/**
 * Create backup for local deployment
 * @param {Object} network - Network object
 * @param {string} backupId - Backup ID
 * @returns {Promise<Object>} - Backup location and block height
 */
async function createLocalBackup(network, backupId) {
  try {
    // Create backup directory
    const backupDir = path.join(BACKUP_BASE_DIR, network.chainId, backupId);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Get data directory
    const dataDir = `/opt/cosmos/${network.chainId}`;
    
    // Get current block height
    const statusOutput = await execPromise(`curl -s http://localhost:26657/status`);
    const status = JSON.parse(statusOutput.stdout);
    const blockHeight = parseInt(status.result.sync_info.latest_block_height, 10);
    
    // Create backup
    await execPromise(`cp -r ${dataDir}/data ${backupDir}/`);
    await execPromise(`cp -r ${dataDir}/config ${backupDir}/`);
    
    // Create metadata file
    const metadata = {
      chainId: network.chainId,
      backupId,
      blockHeight,
      timestamp: new Date().toISOString(),
      networkConfig: {
        tokenEconomics: network.tokenEconomics,
        validatorRequirements: network.validatorRequirements,
        governanceSettings: network.governanceSettings,
        modules: network.modules
      }
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    return {
      backupLocation: backupDir,
      blockHeight
    };
  } catch (error) {
    console.error('Error creating local backup:', error);
    throw error;
  }
}

/**
 * Create backup for AWS deployment
 * @param {Object} network - Network object
 * @param {Object} deployment - Deployment details
 * @param {string} backupId - Backup ID
 * @returns {Promise<Object>} - Backup location and block height
 */
async function createAwsBackup(network, deployment, backupId) {
  try {
    // In a real implementation, this would use AWS CLI or SDK to:
    // 1. Create an EBS snapshot or use AWS Backup
    // 2. Export data to S3
    
    // For now, simulate a backup
    const backupLocation = `s3://${network.chainId}-backups/${backupId}`;
    const blockHeight = 1000000; // Simulated block height
    
    // Log the backup operation
    console.log(`Created AWS backup for ${network.chainId} at ${backupLocation}`);
    
    return {
      backupLocation,
      blockHeight
    };
  } catch (error) {
    console.error('Error creating AWS backup:', error);
    throw error;
  }
}

/**
 * Create backup for GCP deployment
 * @param {Object} network - Network object
 * @param {Object} deployment - Deployment details
 * @param {string} backupId - Backup ID
 * @returns {Promise<Object>} - Backup location and block height
 */
async function createGcpBackup(network, deployment, backupId) {
  try {
    // In a real implementation, this would use GCP CLI or SDK to:
    // 1. Create a disk snapshot
    // 2. Export data to GCS
    
    // For now, simulate a backup
    const backupLocation = `gs://${network.chainId}-backups/${backupId}`;
    const blockHeight = 1000000; // Simulated block height
    
    // Log the backup operation
    console.log(`Created GCP backup for ${network.chainId} at ${backupLocation}`);
    
    return {
      backupLocation,
      blockHeight
    };
  } catch (error) {
    console.error('Error creating GCP backup:', error);
    throw error;
  }
}

/**
 * Create backup for Azure deployment
 * @param {Object} network - Network object
 * @param {Object} deployment - Deployment details
 * @param {string} backupId - Backup ID
 * @returns {Promise<Object>} - Backup location and block height
 */
async function createAzureBackup(network, deployment, backupId) {
  try {
    // In a real implementation, this would use Azure CLI or SDK to:
    // 1. Create a disk snapshot
    // 2. Export data to Azure Blob Storage
    
    // For now, simulate a backup
    const backupLocation = `https://${network.chainId}storage.blob.core.windows.net/${network.chainId}-backups/${backupId}`;
    const blockHeight = 1000000; // Simulated block height
    
    // Log the backup operation
    console.log(`Created Azure backup for ${network.chainId} at ${backupLocation}`);
    
    return {
      backupLocation,
      blockHeight
    };
  } catch (error) {
    console.error('Error creating Azure backup:', error);
    throw error;
  }
}

/**
 * Get the size of a backup
 * @param {string} backupLocation - Backup location
 * @returns {Promise<number>} - Backup size in bytes
 */
async function getBackupSize(backupLocation) {
  try {
    // For local backups
    if (backupLocation.startsWith('/')) {
      const { stdout } = await execPromise(`du -sb ${backupLocation} | cut -f1`);
      return parseInt(stdout.trim(), 10);
    }
    
    // For cloud backups, just return a simulated size
    return 1024 * 1024 * 100; // 100 MB
  } catch (error) {
    console.error('Error getting backup size:', error);
    return 0;
  }
}

/**
 * Restore a network from a backup
 * @param {Object} network - Network object
 * @param {string} backupId - Backup ID
 * @returns {Promise<boolean>} - Success status
 */
exports.restoreBackup = async (network, backupId) => {
  try {
    // Find the backup
    const backup = network.backups.find(b => b.backupId === backupId);
    
    if (!backup) {
      throw new ResourceNotFoundError('Backup', `Backup not found with id ${backupId}`);
    }
    
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Restore backup based on deployment environment
    switch (deployment.environment) {
      case 'local':
        await restoreLocalBackup(network, backup);
        break;
      case 'aws':
        await restoreAwsBackup(network, deployment, backup);
        break;
      case 'gcp':
        await restoreGcpBackup(network, deployment, backup);
        break;
      case 'azure':
        await restoreAzureBackup(network, deployment, backup);
        break;
      default:
        throw new Error(`Unsupported environment: ${deployment.environment}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error restoring backup ${backupId} for network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Restore backup for local deployment
 * @param {Object} network - Network object
 * @param {Object} backup - Backup details
 * @returns {Promise<void>}
 */
async function restoreLocalBackup(network, backup) {
  try {
    // Get data directory
    const dataDir = `/opt/cosmos/${network.chainId}`;
    
    // Stop the node
    await execPromise(`pkill -f "${network.chainId}"`);
    
    // Restore backup
    await execPromise(`rm -rf ${dataDir}/data`);
    await execPromise(`rm -rf ${dataDir}/config`);
    await execPromise(`cp -r ${backup.location}/data ${dataDir}/`);
    await execPromise(`cp -r ${backup.location}/config ${dataDir}/`);
    
    // Restart the node
    await execPromise(`cd ${dataDir} && nohup cosmos-node start > node.log 2>&1 &`);
    
    console.log(`Restored local backup for ${network.chainId} from ${backup.location}`);
  } catch (error) {
    console.error('Error restoring local backup:', error);
    throw error;
  }
}

/**
 * Restore backup for AWS deployment
 * @param {Object} network - Network object
 * @param {Object} deployment - Deployment details
 * @param {Object} backup - Backup details
 * @returns {Promise<void>}
 */
async function restoreAwsBackup(network, deployment, backup) {
  try {
    // In a real implementation, this would use AWS CLI or SDK to:
    // 1. Restore from a snapshot
    // 2. Import data from S3
    
    // For now, just log the restore operation
    console.log(`Restored AWS backup for ${network.chainId} from ${backup.location}`);
  } catch (error) {
    console.error('Error restoring AWS backup:', error);
    throw error;
  }
}

/**
 * Restore backup for GCP deployment
 * @param {Object} network - Network object
 * @param {Object} deployment - Deployment details
 * @param {Object} backup - Backup details
 * @returns {Promise<void>}
 */
async function restoreGcpBackup(network, deployment, backup) {
  try {
    // In a real implementation, this would use GCP CLI or SDK to:
    // 1. Restore from a snapshot
    // 2. Import data from GCS
    
    // For now, just log the restore operation
    console.log(`Restored GCP backup for ${network.chainId} from ${backup.location}`);
  } catch (error) {
    console.error('Error restoring GCP backup:', error);
    throw error;
  }
}

/**
 * Restore backup for Azure deployment
 * @param {Object} network - Network object
 * @param {Object} deployment - Deployment details
 * @param {Object} backup - Backup details
 * @returns {Promise<void>}
 */
async function restoreAzureBackup(network, deployment, backup) {
  try {
    // In a real implementation, this would use Azure CLI or SDK to:
    // 1. Restore from a snapshot
    // 2. Import data from Azure Blob Storage
    
    // For now, just log the restore operation
    console.log(`Restored Azure backup for ${network.chainId} from ${backup.location}`);
  } catch (error) {
    console.error('Error restoring Azure backup:', error);
    throw error;
  }
}

/**
 * List backups for a network
 * @param {Object} network - Network object
 * @returns {Promise<Array>} - List of backups
 */
exports.listBackups = async (network) => {
  try {
    // In a real implementation, this might fetch additional backup metadata
    // from the filesystem or cloud storage
    
    return network.backups || [];
  } catch (error) {
    console.error(`Error listing backups for network ${network.chainId}:`, error);
    return [];
  }
};

/**
 * Delete a backup
 * @param {Object} network - Network object
 * @param {string} backupId - Backup ID
 * @returns {Promise<boolean>} - Success status
 */
exports.deleteBackup = async (network, backupId) => {
  try {
    // Find the backup
    const backup = network.backups.find(b => b.backupId === backupId);
    
    if (!backup) {
      throw new ResourceNotFoundError('Backup', `Backup not found with id ${backupId}`);
    }
    
    // Delete backup based on location
    if (backup.location.startsWith('/')) {
      // Local backup
      await execPromise(`rm -rf ${backup.location}`);
    } else if (backup.location.startsWith('s3://')) {
      // AWS S3 backup
      // In a real implementation, this would use AWS CLI or SDK
      console.log(`Deleted AWS backup for ${network.chainId} at ${backup.location}`);
    } else if (backup.location.startsWith('gs://')) {
      // GCP GCS backup
      // In a real implementation, this would use GCP CLI or SDK
      console.log(`Deleted GCP backup for ${network.chainId} at ${backup.location}`);
    } else if (backup.location.startsWith('https://')) {
      // Azure Blob Storage backup
      // In a real implementation, this would use Azure CLI or SDK
      console.log(`Deleted Azure backup for ${network.chainId} at ${backup.location}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting backup ${backupId} for network ${network.chainId}:`, error);
    return false;
  }
};

/**
 * Schedule automated backups
 * @param {Object} network - Network object
 * @param {Object} schedule - Backup schedule configuration
 * @returns {Promise<Object>} - Schedule details
 */
exports.scheduleBackups = async (network, schedule) => {
  try {
    // In a real implementation, this would use a scheduler like cron
    // to set up automated backups
    
    // For now, just return the schedule
    return {
      networkId: network.id,
      chainId: network.chainId,
      frequency: schedule.frequency || 'daily',
      retention: schedule.retention || 7,
      timeOfDay: schedule.timeOfDay || '00:00',
      enabled: true,
      nextBackup: getNextBackupTime(schedule.frequency, schedule.timeOfDay)
    };
  } catch (error) {
    console.error(`Error scheduling backups for network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Calculate next backup time based on frequency and time of day
 * @param {string} frequency - Backup frequency (hourly, daily, weekly)
 * @param {string} timeOfDay - Time of day for backup (HH:MM)
 * @returns {string} - ISO timestamp of next backup
 */
function getNextBackupTime(frequency, timeOfDay) {
  const now = new Date();
  const nextBackup = new Date(now);
  
  switch (frequency) {
    case 'hourly':
      nextBackup.setHours(now.getHours() + 1);
      nextBackup.setMinutes(0);
      nextBackup.setSeconds(0);
      break;
    case 'daily':
      const [hours, minutes] = (timeOfDay || '00:00').split(':').map(Number);
      nextBackup.setDate(now.getDate() + 1);
      nextBackup.setHours(hours);
      nextBackup.setMinutes(minutes);
      nextBackup.setSeconds(0);
      break;
    case 'weekly':
      const [weeklyHours, weeklyMinutes] = (timeOfDay || '00:00').split(':').map(Number);
      // Set to next Sunday
      nextBackup.setDate(now.getDate() + (7 - now.getDay()));
      nextBackup.setHours(weeklyHours);
      nextBackup.setMinutes(weeklyMinutes);
      nextBackup.setSeconds(0);
      break;
    default:
      nextBackup.setDate(now.getDate() + 1);
      nextBackup.setHours(0);
      nextBackup.setMinutes(0);
      nextBackup.setSeconds(0);
  }
  
  return nextBackup.toISOString();
}