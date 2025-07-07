/**
 * Terraform Utility
 * 
 * Provides functions for generating and executing Terraform configurations
 * to provision blockchain infrastructure.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Generate Terraform configuration for AWS deployment
 * @param {Object} network - Network object containing configuration
 * @param {Object} options - Deployment options
 * @returns {Object} - Terraform configuration files
 */
exports.generateAwsConfig = (network, options = {}) => {
  // Default options
  const defaults = {
    region: 'us-west-2',
    instanceType: 't3.medium',
    nodeCount: 1,
    volumeSize: 100,
    sshKeyName: 'cosmos-deploy',
    vpcCidr: '10.0.0.0/16',
    subnetCidr: '10.0.1.0/24',
  };
  
  // Merge options with defaults
  const config = { ...defaults, ...options };
  
  // Generate main.tf
  const mainTf = `
# AWS Provider Configuration
provider "aws" {
  region = "${config.region}"
}

# VPC Configuration
resource "aws_vpc" "cosmos_vpc" {
  cidr_block           = "${config.vpcCidr}"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "${network.name}-vpc"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "cosmos_igw" {
  vpc_id = aws_vpc.cosmos_vpc.id
  
  tags = {
    Name        = "${network.name}-igw"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
  }
}

# Subnet Configuration
resource "aws_subnet" "cosmos_subnet" {
  vpc_id                  = aws_vpc.cosmos_vpc.id
  cidr_block              = "${config.subnetCidr}"
  map_public_ip_on_launch = true
  availability_zone       = "\${data.aws_availability_zones.available.names[0]}"
  
  tags = {
    Name        = "${network.name}-subnet"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
  }
}

# Route Table
resource "aws_route_table" "cosmos_route_table" {
  vpc_id = aws_vpc.cosmos_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.cosmos_igw.id
  }
  
  tags = {
    Name        = "${network.name}-route-table"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
  }
}

# Route Table Association
resource "aws_route_table_association" "cosmos_rta" {
  subnet_id      = aws_subnet.cosmos_subnet.id
  route_table_id = aws_route_table.cosmos_route_table.id
}

# Security Group
resource "aws_security_group" "cosmos_sg" {
  name        = "${network.name}-sg"
  description = "Security group for ${network.name} blockchain nodes"
  vpc_id      = aws_vpc.cosmos_vpc.id
  
  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Tendermint P2P
  ingress {
    from_port   = 26656
    to_port     = 26656
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Tendermint RPC
  ingress {
    from_port   = 26657
    to_port     = 26657
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Cosmos REST API
  ingress {
    from_port   = 1317
    to_port     = 1317
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Prometheus
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Grafana
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "${network.name}-sg"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
  }
}

# Data source for availability zones
data "aws_availability_zones" "available" {}

# EC2 Instance
resource "aws_instance" "cosmos_node" {
  count         = ${config.nodeCount}
  ami           = data.aws_ami.ubuntu.id
  instance_type = "${config.instanceType}"
  subnet_id     = aws_subnet.cosmos_subnet.id
  
  vpc_security_group_ids = [
    aws_security_group.cosmos_sg.id
  ]
  
  key_name = "${config.sshKeyName}"
  
  root_block_device {
    volume_size = ${config.volumeSize}
    volume_type = "gp3"
  }
  
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y curl jq build-essential git wget
              
              # Install Go
              wget https://golang.org/dl/go1.18.3.linux-amd64.tar.gz
              tar -C /usr/local -xzf go1.18.3.linux-amd64.tar.gz
              echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
              
              # Install Cosmos SDK
              git clone https://github.com/cosmos/cosmos-sdk.git
              cd cosmos-sdk
              git checkout ${config.cosmosSdkVersion || 'v0.45.4'}
              make install
              
              # Setup chain home directory
              mkdir -p /opt/cosmos/${network.chainId}
              
              # Generate chain config
              cd /opt/cosmos/${network.chainId}
              # Configuration will be supplied via cloud-init or custom AMI
              EOF
  
  tags = {
    Name        = "${network.name}-node-\${count.index + 1}"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
    NodeType    = count.index == 0 ? "validator" : "full-node"
  }
}

# Latest Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  
  owners = ["099720109477"] # Canonical
}

# Elastic IP
resource "aws_eip" "cosmos_eip" {
  count    = ${config.nodeCount}
  instance = aws_instance.cosmos_node[count.index].id
  domain   = "vpc"
  
  tags = {
    Name        = "${network.name}-eip-\${count.index + 1}"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
  }
}

# S3 Bucket for backups
resource "aws_s3_bucket" "cosmos_backups" {
  bucket = "${network.chainId}-backups"
  
  tags = {
    Name        = "${network.name}-backups"
    Environment = "${config.environment || 'dev'}"
    ChainId     = "${network.chainId}"
    ManagedBy   = "cosmos-deploy-platform"
  }
}

# Output values
output "validator_ip" {
  value = aws_eip.cosmos_eip[0].public_ip
}

output "rpc_endpoint" {
  value = "http://\${aws_eip.cosmos_eip[0].public_ip}:26657"
}

output "rest_endpoint" {
  value = "http://\${aws_eip.cosmos_eip[0].public_ip}:1317"
}

output "backup_bucket" {
  value = aws_s3_bucket.cosmos_backups.bucket
}
`;

  // Generate variables.tf
  const variablesTf = `
variable "region" {
  description = "AWS region to deploy the network"
  default     = "${config.region}"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "${config.instanceType}"
}

variable "node_count" {
  description = "Number of nodes to deploy"
  default     = ${config.nodeCount}
}

variable "volume_size" {
  description = "Root volume size in GB"
  default     = ${config.volumeSize}
}

variable "ssh_key_name" {
  description = "SSH key name for EC2 instances"
  default     = "${config.sshKeyName}"
}

variable "environment" {
  description = "Deployment environment"
  default     = "${config.environment || 'dev'}"
}
`;

  return {
    'main.tf': mainTf,
    'variables.tf': variablesTf
  };
};

/**
 * Generate Terraform configuration for GCP deployment
 * @param {Object} network - Network object containing configuration
 * @param {Object} options - Deployment options
 * @returns {Object} - Terraform configuration files
 */
exports.generateGcpConfig = (network, options = {}) => {
  // Default options
  const defaults = {
    region: 'us-central1',
    zone: 'us-central1-a',
    machineType: 'e2-medium',
    nodeCount: 1,
    diskSize: 100,
  };
  
  // Merge options with defaults
  const config = { ...defaults, ...options };
  
  // Generate main.tf
  const mainTf = `
# GCP Provider Configuration
provider "google" {
  project = "${config.project}"
  region  = "${config.region}"
  zone    = "${config.zone}"
}

# VPC Network
resource "google_compute_network" "cosmos_vpc" {
  name                    = "${network.name}-vpc"
  auto_create_subnetworks = false
}

# Subnet
resource "google_compute_subnetwork" "cosmos_subnet" {
  name          = "${network.name}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.cosmos_vpc.id
  region        = "${config.region}"
}

# Firewall Rules
resource "google_compute_firewall" "cosmos_firewall" {
  name    = "${network.name}-firewall"
  network = google_compute_network.cosmos_vpc.name
  
  allow {
    protocol = "tcp"
    ports    = ["22", "26656", "26657", "1317", "9090", "3000"]
  }
  
  source_ranges = ["0.0.0.0/0"]
}

# Compute Instances
resource "google_compute_instance" "cosmos_node" {
  count        = ${config.nodeCount}
  name         = "${network.name}-node-\${count.index + 1}"
  machine_type = "${config.machineType}"
  zone         = "${config.zone}"
  
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
      size  = ${config.diskSize}
      type  = "pd-ssd"
    }
  }
  
  network_interface {
    subnetwork = google_compute_subnetwork.cosmos_subnet.name
    access_config {
      // Ephemeral public IP
    }
  }
  
  metadata = {
    ssh-keys = "${config.sshUser || 'ubuntu'}:${config.sshKey || ''}"
  }
  
  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y curl jq build-essential git wget
    
    # Install Go
    wget https://golang.org/dl/go1.18.3.linux-amd64.tar.gz
    tar -C /usr/local -xzf go1.18.3.linux-amd64.tar.gz
    echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
    
    # Install Cosmos SDK
    git clone https://github.com/cosmos/cosmos-sdk.git
    cd cosmos-sdk
    git checkout ${config.cosmosSdkVersion || 'v0.45.4'}
    make install
    
    # Setup chain home directory
    mkdir -p /opt/cosmos/${network.chainId}
  EOF
  
  tags = ["cosmos", "${network.chainId}", "blockchain"]
  
  labels = {
    environment = "${config.environment || 'dev'}"
    chain_id    = "${network.chainId}"
    managed_by  = "cosmos-deploy-platform"
    node_type   = count.index == 0 ? "validator" : "full-node"
  }
}

# External IP Addresses
resource "google_compute_address" "cosmos_ip" {
  count  = ${config.nodeCount}
  name   = "${network.name}-ip-\${count.index + 1}"
  region = "${config.region}"
}

# GCS Bucket for backups
resource "google_storage_bucket" "cosmos_backups" {
  name     = "${network.chainId}-backups"
  location = "${config.region}"
  
  uniform_bucket_level_access = true
  
  labels = {
    environment = "${config.environment || 'dev'}"
    chain_id    = "${network.chainId}"
    managed_by  = "cosmos-deploy-platform"
  }
}

# Output values
output "validator_ip" {
  value = google_compute_instance.cosmos_node[0].network_interface[0].access_config[0].nat_ip
}

output "rpc_endpoint" {
  value = "http://\${google_compute_instance.cosmos_node[0].network_interface[0].access_config[0].nat_ip}:26657"
}

output "rest_endpoint" {
  value = "http://\${google_compute_instance.cosmos_node[0].network_interface[0].access_config[0].nat_ip}:1317"
}

output "backup_bucket" {
  value = google_storage_bucket.cosmos_backups.name
}
`;

  // Generate variables.tf
  const variablesTf = `
variable "project" {
  description = "GCP project ID"
  default     = "${config.project}"
}

variable "region" {
  description = "GCP region to deploy the network"
  default     = "${config.region}"
}

variable "zone" {
  description = "GCP zone to deploy the network"
  default     = "${config.zone}"
}

variable "machine_type" {
  description = "GCP machine type"
  default     = "${config.machineType}"
}

variable "node_count" {
  description = "Number of nodes to deploy"
  default     = ${config.nodeCount}
}

variable "disk_size" {
  description = "Boot disk size in GB"
  default     = ${config.diskSize}
}

variable "environment" {
  description = "Deployment environment"
  default     = "${config.environment || 'dev'}"
}
`;

  return {
    'main.tf': mainTf,
    'variables.tf': variablesTf
  };
};

/**
 * Generate Terraform configuration for Azure deployment
 * @param {Object} network - Network object containing configuration
 * @param {Object} options - Deployment options
 * @returns {Object} - Terraform configuration files
 */
exports.generateAzureConfig = (network, options = {}) => {
  // Default options
  const defaults = {
    location: 'eastus',
    vmSize: 'Standard_D2s_v3',
    nodeCount: 1,
    diskSize: 100,
  };
  
  // Merge options with defaults
  const config = { ...defaults, ...options };
  
  // Generate main.tf
  const mainTf = `
# Azure Provider Configuration
provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "cosmos_rg" {
  name     = "${network.name}-rg"
  location = "${config.location}"
  
  tags = {
    environment = "${config.environment || 'dev'}"
    chain_id    = "${network.chainId}"
    managed_by  = "cosmos-deploy-platform"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "cosmos_vnet" {
  name                = "${network.name}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.cosmos_rg.location
  resource_group_name = azurerm_resource_group.cosmos_rg.name
}

# Subnet
resource "azurerm_subnet" "cosmos_subnet" {
  name                 = "${network.name}-subnet"
  resource_group_name  = azurerm_resource_group.cosmos_rg.name
  virtual_network_name = azurerm_virtual_network.cosmos_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Public IP
resource "azurerm_public_ip" "cosmos_ip" {
  count               = ${config.nodeCount}
  name                = "${network.name}-ip-\${count.index + 1}"
  location            = azurerm_resource_group.cosmos_rg.location
  resource_group_name = azurerm_resource_group.cosmos_rg.name
  allocation_method   = "Static"
  
  tags = {
    environment = "${config.environment || 'dev'}"
    chain_id    = "${network.chainId}"
    managed_by  = "cosmos-deploy-platform"
  }
}

# Network Security Group
resource "azurerm_network_security_group" "cosmos_nsg" {
  name                = "${network.name}-nsg"
  location            = azurerm_resource_group.cosmos_rg.location
  resource_group_name = azurerm_resource_group.cosmos_rg.name
  
  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "TendermintP2P"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "26656"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "TendermintRPC"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "26657"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "CosmosREST"
    priority                   = 1004
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "1317"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "Prometheus"
    priority                   = 1005
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "9090"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "Grafana"
    priority                   = 1006
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  tags = {
    environment = "${config.environment || 'dev'}"
    chain_id    = "${network.chainId}"
    managed_by  = "cosmos-deploy-platform"
  }
}

# Network Interface
resource "azurerm_network_interface" "cosmos_nic" {
  count               = ${config.nodeCount}
  name                = "${network.name}-nic-\${count.index + 1}"
  location            = azurerm_resource_group.cosmos_rg.location
  resource_group_name = azurerm_resource_group.cosmos_rg.name
  
  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.cosmos_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.cosmos_ip[count.index].id
  }
}

# Network Interface Security Group Association
resource "azurerm_network_interface_security_group_association" "cosmos_nic_nsg" {
  count                     = ${config.nodeCount}
  network_interface_id      = azurerm_network_interface.cosmos_nic[count.index].id
  network_security_group_id = azurerm_network_security_group.cosmos_nsg.id
}

# Virtual Machine
resource "azurerm_linux_virtual_machine" "cosmos_vm" {
  count               = ${config.nodeCount}
  name                = "${network.name}-vm-\${count.index + 1}"
  location            = azurerm_resource_group.cosmos_rg.location
  resource_group_name = azurerm_resource_group.cosmos_rg.name
  size                = "${config.vmSize}"
  admin_username      = "${config.adminUsername || 'azureuser'}"
  network_interface_ids = [
    azurerm_network_interface.cosmos_nic[count.index].id,
  ]
  
  admin_ssh_key {
    username   = "${config.adminUsername || 'azureuser'}"
    public_key = "${config.sshKey || ''}"
  }
  
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_size_gb         = ${config.diskSize}
  }
  
  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
  
  custom_data = base64encode(<<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y curl jq build-essential git wget
    
    # Install Go
    wget https://golang.org/dl/go1.18.3.linux-amd64.tar.gz
    tar -C /usr/local -xzf go1.18.3.linux-amd64.tar.gz
    echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
    
    # Install Cosmos SDK
    git clone https://github.com/cosmos/cosmos-sdk.git
    cd cosmos-sdk
    git checkout ${config.cosmosSdkVersion || 'v0.45.4'}
    make install
    
    # Setup chain home directory
    mkdir -p /opt/cosmos/${network.chainId}
  EOF
  )
  
  tags = {
    environment = "${config.environment || 'dev'}"
    chain_id    = "${network.chainId}"
    managed_by  = "cosmos-deploy-platform"
    node_type   = count.index == 0 ? "validator" : "full-node"
  }
}

# Storage Account for backups
resource "azurerm_storage_account" "cosmos_storage" {
  name                     = "${network.chainId}storage"
  resource_group_name      = azurerm_resource_group.cosmos_rg.name
  location                 = azurerm_resource_group.cosmos_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  tags = {
    environment = "${config.environment || 'dev'}"
    chain_id    = "${network.chainId}"
    managed_by  = "cosmos-deploy-platform"
  }
}

# Storage Container for backups
resource "azurerm_storage_container" "cosmos_backups" {
  name                  = "${network.chainId}-backups"
  storage_account_name  = azurerm_storage_account.cosmos_storage.name
  container_access_type = "private"
}

# Output values
output "validator_ip" {
  value = azurerm_public_ip.cosmos_ip[0].ip_address
}

output "rpc_endpoint" {
  value = "http://\${azurerm_public_ip.cosmos_ip[0].ip_address}:26657"
}

output "rest_endpoint" {
  value = "http://\${azurerm_public_ip.cosmos_ip[0].ip_address}:1317"
}

output "backup_container" {
  value = azurerm_storage_container.cosmos_backups.name
}
`;

  // Generate variables.tf
  const variablesTf = `
variable "location" {
  description = "Azure location to deploy the network"
  default     = "${config.location}"
}

variable "vm_size" {
  description = "Azure VM size"
  default     = "${config.vmSize}"
}

variable "node_count" {
  description = "Number of nodes to deploy"
  default     = ${config.nodeCount}
}

variable "disk_size" {
  description = "OS disk size in GB"
  default     = ${config.diskSize}
}

variable "admin_username" {
  description = "Admin username for the VMs"
  default     = "${config.adminUsername || 'azureuser'}"
}

variable "environment" {
  description = "Deployment environment"
  default     = "${config.environment || 'dev'}"
}
`;

  return {
    'main.tf': mainTf,
    'variables.tf': variablesTf
  };
};

/**
 * Generate Terraform configuration for local deployment
 * @param {Object} network - Network object containing configuration
 * @param {Object} options - Deployment options
 * @returns {Object} - Terraform configuration files
 */
exports.generateLocalConfig = (network, options = {}) => {
  // Define path for local files
  const localPath = options.localPath || `/opt/cosmos/${network.chainId}`;
  
  // Generate main.tf for local deployment
  const mainTf = `
# Local deployment doesn't need much infrastructure, 
# but we still use Terraform for consistency

# Local File Provisioner
resource "local_file" "genesis_json" {
  content  = jsonencode(${JSON.stringify(options.genesis || {})})
  filename = "${localPath}/config/genesis.json"
}

resource "local_file" "config_toml" {
  content  = <<-EOT
    # This is a TOML config file for Cosmos nodes
    
    [rpc]
    laddr = "tcp://0.0.0.0:26657"
    
    [p2p]
    laddr = "tcp://0.0.0.0:26656"
    
    [rest]
    laddr = "tcp://0.0.0.0:1317"
    
    [statesync]
    enable = false
    
    [instrumentation]
    prometheus = true
    prometheus_listen_addr = ":9090"
  EOT
  filename = "${localPath}/config/config.toml"
}

resource "local_file" "app_toml" {
  content  = <<-EOT
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
  EOT
  filename = "${localPath}/config/app.toml"
}

# Output values
output "rpc_endpoint" {
  value = "http://localhost:26657"
}

output "rest_endpoint" {
  value = "http://localhost:1317"
}

output "local_path" {
  value = "${localPath}"
}
`;

  return {
    'main.tf': mainTf
  };
};

/**
 * Execute Terraform commands
 * @param {string} cmd - Terraform command (init, plan, apply, destroy)
 * @param {string} workingDir - Directory containing Terraform files
 * @returns {Promise<Object>} - Command result
 */
exports.executeTerraform = async (cmd, workingDir) => {
  try {
    // Ensure directory exists
    if (!fs.existsSync(workingDir)) {
      throw new Error(`Working directory ${workingDir} does not exist`);
    }
    
    // Execute Terraform command
    const { stdout, stderr } = await execPromise(`cd ${workingDir} && terraform ${cmd}`);
    
    return { success: true, stdout, stderr };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr 
    };
  }
};

/**
 * Write Terraform configuration to files
 * @param {Object} config - Terraform configuration files
 * @param {string} outputDir - Directory to write files to
 * @returns {Promise<boolean>} - Success status
 */
exports.writeTerraformConfig = async (config, outputDir) => {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write each file
    Object.entries(config).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(outputDir, filename), content);
    });
    
    return true;
  } catch (error) {
    console.error('Error writing Terraform config:', error);
    return false;
  }
};

/**
 * Parse Terraform output
 * @param {string} output - Terraform output string
 * @returns {Object} - Parsed output
 */
exports.parseTerraformOutput = (output) => {
  try {
    // Extract JSON output
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, return empty object
    return {};
  } catch (error) {
    console.error('Error parsing Terraform output:', error);
    return {};
  }
};