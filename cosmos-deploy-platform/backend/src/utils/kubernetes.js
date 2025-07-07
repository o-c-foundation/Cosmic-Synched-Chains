/**
 * Kubernetes Utility
 * 
 * Provides functions for generating and applying Kubernetes manifests
 * to deploy and manage blockchain nodes.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const yaml = require('js-yaml');

// Base directory for Kubernetes manifests
const K8S_MANIFESTS_DIR = process.env.K8S_MANIFESTS_DIR || '/tmp/cosmos-k8s';

/**
 * Generate Kubernetes manifests for a network
 * @param {Object} network - Network object containing configuration
 * @param {Object} outputs - Terraform outputs
 * @returns {Object} - Kubernetes manifest files
 */
exports.generateManifests = (network, outputs = {}) => {
  // Create manifests directory if it doesn't exist
  const networkManifestsDir = path.join(K8S_MANIFESTS_DIR, network.chainId);
  
  if (!fs.existsSync(networkManifestsDir)) {
    fs.mkdirSync(networkManifestsDir, { recursive: true });
  }
  
  // Generate manifests
  const manifests = {
    namespace: generateNamespaceManifest(network),
    configmap: generateConfigMapManifest(network),
    secret: generateSecretManifest(network),
    deployment: generateDeploymentManifest(network),
    service: generateServiceManifest(network),
    ingress: generateIngressManifest(network, outputs),
    monitoring: generateMonitoringManifests(network),
  };
  
  // Write manifests to files
  Object.entries(manifests).forEach(([name, content]) => {
    if (content) {
      fs.writeFileSync(
        path.join(networkManifestsDir, `${name}.yaml`),
        yaml.dump(content)
      );
    }
  });
  
  return manifests;
};

/**
 * Generate namespace manifest
 * @param {Object} network - Network object
 * @returns {Object} - Namespace manifest
 */
function generateNamespaceManifest(network) {
  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: `cosmos-${network.chainId}`,
      labels: {
        name: `cosmos-${network.chainId}`,
        'app.kubernetes.io/name': 'cosmos',
        'app.kubernetes.io/instance': network.chainId,
        'app.kubernetes.io/managed-by': 'cosmos-deploy-platform'
      }
    }
  };
}

/**
 * Generate ConfigMap manifest
 * @param {Object} network - Network object
 * @returns {Object} - ConfigMap manifest
 */
function generateConfigMapManifest(network) {
  // Create a ConfigMap for node configuration
  return {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: `${network.chainId}-config`,
      namespace: `cosmos-${network.chainId}`
    },
    data: {
      'config.toml': `
# This is a TOML config file for Cosmos nodes

[rpc]
laddr = "tcp://0.0.0.0:26657"

[p2p]
laddr = "tcp://0.0.0.0:26656"
seeds = ""
persistent_peers = ""

[mempool]
size = 5000
max_tx_bytes = 1048576

[consensus]
timeout_propose = "3s"
timeout_prevote = "1s"
timeout_precommit = "1s"
timeout_commit = "5s"

[tx_index]
indexer = "kv"

[instrumentation]
prometheus = true
prometheus_listen_addr = ":9090"
`,
      'app.toml': `
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
snapshot-interval = 1000
snapshot-keep-recent = 10
`,
      'genesis-template.json': JSON.stringify({
        chain_id: network.chainId,
        app_state: {
          staking: {
            params: {
              unbonding_time: `${network.validatorRequirements.unbondingPeriod * 24}h`,
              max_validators: network.validatorRequirements.maxValidators || 100,
              bond_denom: network.tokenEconomics.symbol.toLowerCase()
            }
          },
          gov: {
            params: {
              voting_period: `${network.governanceSettings.votingPeriod * 24}h`,
              quorum: network.governanceSettings.quorum.toString(),
              threshold: network.governanceSettings.threshold.toString(),
              veto_threshold: network.governanceSettings.vetoThreshold.toString()
            }
          },
          mint: {
            params: {
              inflation_min: "0.07",
              inflation_max: "0.20",
              inflation_rate_change: "0.13",
              goal_bonded: "0.67",
              blocks_per_year: "6311520"
            }
          }
        }
      }, null, 2)
    }
  };
}

/**
 * Generate Secret manifest
 * @param {Object} network - Network object
 * @returns {Object} - Secret manifest
 */
function generateSecretManifest(network) {
  // Create a Secret for sensitive data
  // In a real implementation, you would generate actual secret values
  return {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: `${network.chainId}-secrets`,
      namespace: `cosmos-${network.chainId}`
    },
    type: 'Opaque',
    data: {
      // Base64 encoded placeholders
      'validator-key': Buffer.from('validator-key-placeholder').toString('base64'),
      'node-key': Buffer.from('node-key-placeholder').toString('base64')
    }
  };
}

/**
 * Generate Deployment manifest
 * @param {Object} network - Network object
 * @returns {Object} - Deployment manifest
 */
function generateDeploymentManifest(network) {
  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: `${network.chainId}-node`,
      namespace: `cosmos-${network.chainId}`,
      labels: {
        app: `${network.chainId}-node`,
        'app.kubernetes.io/name': 'cosmos',
        'app.kubernetes.io/instance': network.chainId,
        'app.kubernetes.io/managed-by': 'cosmos-deploy-platform'
      }
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: `${network.chainId}-node`
        }
      },
      template: {
        metadata: {
          labels: {
            app: `${network.chainId}-node`
          }
        },
        spec: {
          containers: [
            {
              name: 'cosmos-node',
              image: 'tendermint/gaia:latest', // Use appropriate Cosmos SDK image
              ports: [
                { containerPort: 26656, name: 'p2p' },
                { containerPort: 26657, name: 'rpc' },
                { containerPort: 1317, name: 'rest' },
                { containerPort: 9090, name: 'grpc' },
                { containerPort: 9091, name: 'metrics' }
              ],
              resources: {
                requests: {
                  cpu: '500m',
                  memory: '1Gi'
                },
                limits: {
                  cpu: '2',
                  memory: '4Gi'
                }
              },
              volumeMounts: [
                {
                  name: 'config-volume',
                  mountPath: '/cosmos/config'
                },
                {
                  name: 'data',
                  mountPath: '/cosmos/data'
                },
                {
                  name: 'secrets',
                  mountPath: '/cosmos/secrets',
                  readOnly: true
                }
              ],
              env: [
                {
                  name: 'CHAIN_ID',
                  value: network.chainId
                },
                {
                  name: 'HOME',
                  value: '/cosmos'
                }
              ],
              readinessProbe: {
                httpGet: {
                  path: '/health',
                  port: 26657
                },
                initialDelaySeconds: 30,
                periodSeconds: 10
              },
              livenessProbe: {
                httpGet: {
                  path: '/health',
                  port: 26657
                },
                initialDelaySeconds: 60,
                periodSeconds: 15
              }
            }
          ],
          volumes: [
            {
              name: 'config-volume',
              configMap: {
                name: `${network.chainId}-config`
              }
            },
            {
              name: 'data',
              persistentVolumeClaim: {
                claimName: `${network.chainId}-data`
              }
            },
            {
              name: 'secrets',
              secret: {
                secretName: `${network.chainId}-secrets`
              }
            }
          ]
        }
      }
    }
  };
}

/**
 * Generate PersistentVolumeClaim manifest
 * @param {Object} network - Network object
 * @returns {Object} - PersistentVolumeClaim manifest
 */
function generatePVCManifest(network) {
  return {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: `${network.chainId}-data`,
      namespace: `cosmos-${network.chainId}`
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      resources: {
        requests: {
          storage: '100Gi'
        }
      },
      storageClassName: 'standard'
    }
  };
}

/**
 * Generate Service manifest
 * @param {Object} network - Network object
 * @returns {Object} - Service manifest
 */
function generateServiceManifest(network) {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: `${network.chainId}-service`,
      namespace: `cosmos-${network.chainId}`,
      labels: {
        app: `${network.chainId}-node`,
        'app.kubernetes.io/name': 'cosmos',
        'app.kubernetes.io/instance': network.chainId,
        'app.kubernetes.io/managed-by': 'cosmos-deploy-platform'
      }
    },
    spec: {
      selector: {
        app: `${network.chainId}-node`
      },
      ports: [
        {
          name: 'p2p',
          port: 26656,
          targetPort: 26656
        },
        {
          name: 'rpc',
          port: 26657,
          targetPort: 26657
        },
        {
          name: 'rest',
          port: 1317,
          targetPort: 1317
        },
        {
          name: 'grpc',
          port: 9090,
          targetPort: 9090
        },
        {
          name: 'metrics',
          port: 9091,
          targetPort: 9091
        }
      ],
      type: 'ClusterIP'
    }
  };
}

/**
 * Generate Ingress manifest
 * @param {Object} network - Network object
 * @param {Object} outputs - Terraform outputs
 * @returns {Object} - Ingress manifest
 */
function generateIngressManifest(network, outputs) {
  return {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: `${network.chainId}-ingress`,
      namespace: `cosmos-${network.chainId}`,
      annotations: {
        'kubernetes.io/ingress.class': 'nginx',
        'nginx.ingress.kubernetes.io/ssl-redirect': 'true',
        'nginx.ingress.kubernetes.io/use-regex': 'true',
        'nginx.ingress.kubernetes.io/rewrite-target': '/$1',
        'cert-manager.io/cluster-issuer': 'letsencrypt-prod'
      }
    },
    spec: {
      tls: [
        {
          hosts: [
            `${network.chainId}.cosmos-deploy.example.com`
          ],
          secretName: `${network.chainId}-tls`
        }
      ],
      rules: [
        {
          host: `${network.chainId}.cosmos-deploy.example.com`,
          http: {
            paths: [
              {
                path: '/rpc/(.*)',
                pathType: 'Prefix',
                backend: {
                  service: {
                    name: `${network.chainId}-service`,
                    port: {
                      name: 'rpc'
                    }
                  }
                }
              },
              {
                path: '/rest/(.*)',
                pathType: 'Prefix',
                backend: {
                  service: {
                    name: `${network.chainId}-service`,
                    port: {
                      name: 'rest'
                    }
                  }
                }
              }
            ]
          }
        }
      ]
    }
  };
}

/**
 * Generate monitoring manifests
 * @param {Object} network - Network object
 * @returns {Object} - Monitoring manifests
 */
function generateMonitoringManifests(network) {
  // Generate ServiceMonitor for Prometheus
  return {
    apiVersion: 'monitoring.coreos.com/v1',
    kind: 'ServiceMonitor',
    metadata: {
      name: `${network.chainId}-monitor`,
      namespace: `cosmos-${network.chainId}`,
      labels: {
        app: `${network.chainId}-node`,
        'app.kubernetes.io/name': 'cosmos',
        'app.kubernetes.io/instance': network.chainId,
        'app.kubernetes.io/managed-by': 'cosmos-deploy-platform',
        'release': 'prometheus' // Match your Prometheus operator release name
      }
    },
    spec: {
      selector: {
        matchLabels: {
          app: `${network.chainId}-node`
        }
      },
      endpoints: [
        {
          port: 'metrics',
          interval: '15s',
          path: '/metrics'
        }
      ]
    }
  };
}

/**
 * Apply Kubernetes manifests
 * @param {Object} manifests - Kubernetes manifests
 * @param {string} namespace - Kubernetes namespace
 * @returns {Promise<Object>} - Apply result
 */
exports.applyManifests = async (manifests, namespace) => {
  try {
    // Create directory for manifests if it doesn't exist
    const manifestsDir = path.join(K8S_MANIFESTS_DIR, namespace);
    
    if (!fs.existsSync(manifestsDir)) {
      fs.mkdirSync(manifestsDir, { recursive: true });
    }
    
    // Write all manifests to files
    for (const [name, content] of Object.entries(manifests)) {
      if (content) {
        const filePath = path.join(manifestsDir, `${name}.yaml`);
        fs.writeFileSync(filePath, yaml.dump(content));
      }
    }
    
    // Apply all manifests using kubectl
    const { stdout, stderr } = await execPromise(`kubectl apply -f ${manifestsDir}`);
    
    return {
      success: true,
      stdout,
      stderr,
      manifestsDir
    };
  } catch (error) {
    console.error('Error applying Kubernetes manifests:', error);
    return {
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
};

/**
 * Get Kubernetes resources for a namespace
 * @param {string} namespace - Kubernetes namespace
 * @returns {Promise<Object>} - Kubernetes resources
 */
exports.getResources = async (namespace) => {
  try {
    const k8sNamespace = `cosmos-${namespace}`;
    
    // Get deployments
    const deploymentsOutput = await execPromise(`kubectl get deployments -n ${k8sNamespace} -o json`);
    const deployments = JSON.parse(deploymentsOutput.stdout);
    
    // Get services
    const servicesOutput = await execPromise(`kubectl get services -n ${k8sNamespace} -o json`);
    const services = JSON.parse(servicesOutput.stdout);
    
    // Get pods
    const podsOutput = await execPromise(`kubectl get pods -n ${k8sNamespace} -o json`);
    const pods = JSON.parse(podsOutput.stdout);
    
    // Get persistent volume claims
    const pvcsOutput = await execPromise(`kubectl get pvc -n ${k8sNamespace} -o json`);
    const pvcs = JSON.parse(pvcsOutput.stdout);
    
    return {
      deployments: deployments.items,
      services: services.items,
      pods: pods.items,
      pvcs: pvcs.items
    };
  } catch (error) {
    console.error(`Error getting Kubernetes resources for namespace ${namespace}:`, error);
    return {
      deployments: [],
      services: [],
      pods: [],
      pvcs: []
    };
  }
};

/**
 * Update Kubernetes ConfigMaps
 * @param {string} namespace - Kubernetes namespace
 * @param {Object} configUpdates - Configuration updates
 * @returns {Promise<boolean>} - Success status
 */
exports.updateConfigMaps = async (namespace, configUpdates) => {
  try {
    const k8sNamespace = `cosmos-${namespace}`;
    
    // Get current ConfigMap
    const cmOutput = await execPromise(
      `kubectl get configmap ${namespace}-config -n ${k8sNamespace} -o json`
    );
    
    const configMap = JSON.parse(cmOutput.stdout);
    
    // Update ConfigMap data
    if (configUpdates.config) {
      configMap.data['config.toml'] = configUpdates.config;
    }
    
    if (configUpdates.app) {
      configMap.data['app.toml'] = configUpdates.app;
    }
    
    if (configUpdates.genesis) {
      configMap.data['genesis-template.json'] = JSON.stringify(configUpdates.genesis, null, 2);
    }
    
    // Write updated ConfigMap to a temporary file
    const tempFile = path.join(K8S_MANIFESTS_DIR, `${namespace}-config-update.yaml`);
    fs.writeFileSync(tempFile, yaml.dump(configMap));
    
    // Apply updated ConfigMap
    await execPromise(`kubectl apply -f ${tempFile}`);
    
    return true;
  } catch (error) {
    console.error(`Error updating ConfigMaps for namespace ${namespace}:`, error);
    return false;
  }
};

/**
 * Restart a Kubernetes deployment
 * @param {string} namespace - Kubernetes namespace
 * @returns {Promise<boolean>} - Success status
 */
exports.restartDeployment = async (namespace) => {
  try {
    const k8sNamespace = `cosmos-${namespace}`;
    
    // Restart deployment by patching it
    await execPromise(
      `kubectl rollout restart deployment ${namespace}-node -n ${k8sNamespace}`
    );
    
    // Wait for rollout to complete
    await execPromise(
      `kubectl rollout status deployment ${namespace}-node -n ${k8sNamespace}`
    );
    
    return true;
  } catch (error) {
    console.error(`Error restarting deployment for namespace ${namespace}:`, error);
    return false;
  }
};

/**
 * Delete Kubernetes resources for a namespace
 * @param {string} namespace - Kubernetes namespace
 * @returns {Promise<boolean>} - Success status
 */
exports.deleteResources = async (namespace) => {
  try {
    const k8sNamespace = `cosmos-${namespace}`;
    
    // Delete the namespace and all resources in it
    await execPromise(`kubectl delete namespace ${k8sNamespace}`);
    
    return true;
  } catch (error) {
    console.error(`Error deleting resources for namespace ${namespace}:`, error);
    return false;
  }
};

/**
 * Get logs from a Kubernetes pod
 * @param {string} namespace - Kubernetes namespace
 * @param {string} podName - Pod name (optional, gets first pod if not specified)
 * @param {Object} options - Log options
 * @returns {Promise<string>} - Pod logs
 */
exports.getPodLogs = async (namespace, podName = null, options = {}) => {
  try {
    const k8sNamespace = `cosmos-${namespace}`;
    
    // If no pod name specified, get the first pod
    if (!podName) {
      const podsOutput = await execPromise(
        `kubectl get pods -n ${k8sNamespace} -l app=${namespace}-node -o jsonpath='{.items[0].metadata.name}'`
      );
      podName = podsOutput.stdout.trim();
    }
    
    // Build log command
    let logCmd = `kubectl logs -n ${k8sNamespace} ${podName}`;
    
    if (options.tail) {
      logCmd += ` --tail=${options.tail}`;
    }
    
    if (options.since) {
      logCmd += ` --since=${options.since}`;
    }
    
    if (options.container) {
      logCmd += ` -c ${options.container}`;
    }
    
    // Get logs
    const logsOutput = await execPromise(logCmd);
    
    return logsOutput.stdout;
  } catch (error) {
    console.error(`Error getting logs for pod in namespace ${namespace}:`, error);
    return '';
  }
};