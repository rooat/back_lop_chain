module.exports = {
  apps : [{
    name: 'account',
    script: 'bin/accountTask.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    restart_delay: 10000,
    watch: false,
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss ZZ',
  },
  {
    name: 'masternode',
    script: 'bin/refreshMasterNode.js',
    instances: 1,
    autorestart: true,
    restart_delay: 10000,
    watch: false,
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss ZZ',
  },
  {
    name: 'app',
    script: 'bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 10000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss ZZ',
    env: {
      PORT: 3000,
      NODE_ENV: 'development',
    },
    env_production: {
      PORT: 3000,
      NODE_ENV: 'production',
    }
  }
],


  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
