/**
 * Application Configuration
 * 
 * This file centralizes all configuration variables for the application.
 * Values are loaded from environment variables with sensible defaults.
 */

require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmos-deploy',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'cosmos-deploy-platform-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS configuration
  corsOrigins: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : ['http://localhost:3000'],
  
  // Blockchain configuration
  defaultChainConfig: {
    tendermintVersion: process.env.DEFAULT_TENDERMINT_VERSION || 'v0.34.19',
    cosmosSdkVersion: process.env.DEFAULT_COSMOS_SDK_VERSION || 'v0.45.4',
    blockTime: parseInt(process.env.DEFAULT_BLOCK_TIME || '5', 10), // seconds
  },
  
  // Cloud provider configuration
  cloudProviders: {
    aws: {
      enabled: process.env.AWS_ENABLED === 'true',
      region: process.env.AWS_REGION || 'us-west-2',
      credentialsPath: process.env.AWS_CREDENTIALS_PATH,
    },
    gcp: {
      enabled: process.env.GCP_ENABLED === 'true',
      region: process.env.GCP_REGION || 'us-central1',
      credentialsPath: process.env.GCP_CREDENTIALS_PATH,
    },
    azure: {
      enabled: process.env.AZURE_ENABLED === 'true',
      region: process.env.AZURE_REGION || 'eastus',
      credentialsPath: process.env.AZURE_CREDENTIALS_PATH,
    },
  },
  
  // Kubernetes configuration
  kubernetes: {
    namespace: process.env.K8S_NAMESPACE || 'cosmos-deploy',
    kubeconfig: process.env.KUBECONFIG,
  },
  
  // Monitoring configuration
  monitoring: {
    prometheusUrl: process.env.PROMETHEUS_URL,
    grafanaUrl: process.env.GRAFANA_URL,
    metricsEnabled: process.env.METRICS_ENABLED === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT || '9090', 10),
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    filePath: process.env.LOG_FILE_PATH,
  },
  
  // Storage configuration for backups
  storage: {
    type: process.env.STORAGE_TYPE || 'local', // 'local', 's3', 'gcs'
    localPath: process.env.STORAGE_LOCAL_PATH || './backups',
    s3Bucket: process.env.STORAGE_S3_BUCKET,
    gcsBucket: process.env.STORAGE_GCS_BUCKET,
  },
};

// Validate critical configuration
const validateConfig = () => {
  const requiredEnvVars = [];
  
  // In production, require secure JWT secret
  if (config.nodeEnv === 'production' && config.jwtSecret === 'cosmos-deploy-platform-jwt-secret') {
    console.warn('WARNING: Using default JWT secret in production environment!');
  }
  
  // Check if any required variables are missing
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.warn(`WARNING: Missing required environment variables: ${missingVars.join(', ')}`);
    
    // In production, fail if missing required variables
    if (config.nodeEnv === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
  
  return config;
};

module.exports = validateConfig();