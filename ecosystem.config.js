// 🚀 Configuración de PM2 para Stack21 - Deploy Privado
// =====================================================

module.exports = {
  apps: [
    {
      name: 'stack21-private',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1, // Para deploy privado, 1 instancia es suficiente
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Configuración de logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Configuración de reinicio
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      
      // Configuración de monitoreo
      watch: false, // No watch en producción
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Configuración de cluster (opcional)
      // instances: 'max', // Usar todos los CPUs disponibles
      // exec_mode: 'cluster',
      
      // Configuración de health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Configuración de variables de entorno
      env_file: '.env.production',
      
      // Configuración de source map
      source_map_support: true,
      
      // Configuración de timeouts
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Configuración de merge logs
      merge_logs: true,
      
      // Configuración de autorestart
      autorestart: true,
      
      // Configuración de cron para restart (opcional)
      // cron_restart: '0 2 * * *', // Restart diario a las 2 AM
      
      // Configuración de notificaciones (opcional)
      // notify: true,
      // notify_mode: 'exp-backoff',
      
      // Configuración de variables específicas
      node_args: '--max-old-space-size=1024',
      
      // Configuración de interceptor
      interpreter: 'node',
      interpreter_args: '--harmony',
      
      // Configuración de working directory
      cwd: process.cwd(),
      
      // Configuración de user (opcional)
      // user: 'www-data',
      
      // Configuración de group (opcional)
      // group: 'www-data',
      
      // Configuración de umask (opcional)
      // umask: '022',
      
      // Configuración de pid file
      pid_file: './logs/stack21.pid',
      
      // Configuración de log rotation
      log_type: 'json',
      
      // Configuración de metrics
      pmx: true,
      
      // Configuración de monitoring
      monitoring: false, // Deshabilitado para deploy privado
      
      // Configuración de error handling
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      
      // Configuración de timezone
      time: true,
      
      // Configuración de merge logs
      merge_logs: true,
      
      // Configuración de log rotation
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Configuración de max lines
      max_memory_restart: '1G',
      
      // Configuración de min uptime
      min_uptime: '10s',
      
      // Configuración de max restarts
      max_restarts: 10,
      
      // Configuración de restart delay
      restart_delay: 4000,
      
      // Configuración de exp backoff
      exp_backoff_restart_delay: 100,
      
      // Configuración de kill timeout
      kill_timeout: 5000,
      
      // Configuración de listen timeout
      listen_timeout: 3000,
      
      // Configuración de health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Configuración de source map
      source_map_support: true,
      
      // Configuración de autorestart
      autorestart: true,
      
      // Configuración de watch
      watch: false,
      
      // Configuración de ignore watch
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Configuración de instances
      instances: 1,
      
      // Configuración de exec mode
      exec_mode: 'fork',
      
      // Configuración de script
      script: 'npm',
      
      // Configuración de args
      args: 'start',
      
      // Configuración de cwd
      cwd: './',
      
      // Configuración de env
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      
      // Configuración de env production
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ],

  // Configuración de deploy (opcional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/stack21.git',
      path: '/var/www/stack21',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
