module.exports = {
  apps: [
    {
      name: "backend-api",
      cwd: "/root/Documents/cosmos-deploy-platform/backend",
      script: "src/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/backend-error.log",
      out_file: "/tmp/backend-out.log",
      merge_logs: true
    },
    {
      name: "frontend",
      cwd: "/root/Documents/cosmos-deploy-platform/frontend",
      script: "node_modules/.bin/react-scripts",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        BROWSER: "none",
        // Fix for allowedHosts error
        DANGEROUSLY_DISABLE_HOST_CHECK: true
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/frontend-error.log",
      out_file: "/tmp/frontend-out.log",
      merge_logs: true
    },
    {
      name: "admin-backend",
      cwd: "/root/Documents/cosmos-deploy-platform/admin-panel/server",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 4001
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "300M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/admin-backend-error.log",
      out_file: "/tmp/admin-backend-out.log",
      merge_logs: true
    },
    {
      name: "admin-static",
      cwd: "/root/Documents/cosmos-deploy-platform/admin-panel/static-admin",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "200M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/tmp/admin-static-error.log",
      out_file: "/tmp/admin-static-out.log",
      merge_logs: true
    }
  ]
};
