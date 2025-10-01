// Sistema de Monitoreo y Alertas en Tiempo Real para Stack21
export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
}

export interface Alert {
  id: string;
  type: 'system' | 'performance' | 'security' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  source: string;
  timestamp: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    api: 'healthy' | 'warning' | 'critical';
    database: 'healthy' | 'warning' | 'critical';
    storage: 'healthy' | 'warning' | 'critical';
    network: 'healthy' | 'warning' | 'critical';
  };
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  apiCalls: number;
  responseTime: number;
  errorRate: number;
  timestamp: Date;
}

class MonitoringEngine {
  private metrics: Map<string, SystemMetric> = new Map();
  private alerts: Alert[] = [];
  private systemHealth: SystemHealth;
  private performanceHistory: PerformanceMetrics[] = [];
  private alertCallbacks: ((alert: Alert) => void)[] = [];

  constructor() {
    this.systemHealth = {
      overall: 'healthy',
      components: {
        api: 'healthy',
        database: 'healthy',
        storage: 'healthy',
        network: 'healthy'
      },
      uptime: 99.9,
      responseTime: 45,
      errorRate: 0.1,
      lastUpdated: new Date()
    };

    this.initializeMetrics();
    this.startMonitoring();
  }

  private initializeMetrics(): void {
    const defaultMetrics: Omit<SystemMetric, 'timestamp'>[] = [
      {
        id: 'cpu_usage',
        name: 'Uso de CPU',
        value: 25,
        unit: '%',
        status: 'healthy',
        threshold: { warning: 70, critical: 90 },
        trend: 'stable'
      },
      {
        id: 'memory_usage',
        name: 'Uso de Memoria',
        value: 45,
        unit: '%',
        status: 'healthy',
        threshold: { warning: 80, critical: 95 },
        trend: 'stable'
      },
      {
        id: 'disk_usage',
        name: 'Uso de Disco',
        value: 35,
        unit: '%',
        status: 'healthy',
        threshold: { warning: 85, critical: 95 },
        trend: 'up'
      },
      {
        id: 'api_response_time',
        name: 'Tiempo de Respuesta API',
        value: 45,
        unit: 'ms',
        status: 'healthy',
        threshold: { warning: 500, critical: 1000 },
        trend: 'stable'
      },
      {
        id: 'error_rate',
        name: 'Tasa de Errores',
        value: 0.1,
        unit: '%',
        status: 'healthy',
        threshold: { warning: 2, critical: 5 },
        trend: 'stable'
      },
      {
        id: 'active_users',
        name: 'Usuarios Activos',
        value: 1247,
        unit: 'usuarios',
        status: 'healthy',
        threshold: { warning: 5000, critical: 10000 },
        trend: 'up'
      }
    ];

    defaultMetrics.forEach(metric => {
      this.metrics.set(metric.id, {
        ...metric,
        timestamp: new Date()
      });
    });
  }

  private startMonitoring(): void {
    // Simular monitoreo en tiempo real
    setInterval(() => {
      this.updateMetrics();
      this.checkThresholds();
      this.updateSystemHealth();
    }, 5000); // Cada 5 segundos
  }

  private updateMetrics(): void {
    this.metrics.forEach((metric, id) => {
      // Simular variaciones en las métricas
      const variation = (Math.random() - 0.5) * 10; // ±5%
      const newValue = Math.max(0, metric.value + variation);
      
      // Determinar tendencia
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (newValue > metric.value * 1.02) trend = 'up';
      else if (newValue < metric.value * 0.98) trend = 'down';

      this.metrics.set(id, {
        ...metric,
        value: Math.round(newValue * 100) / 100,
        trend,
        timestamp: new Date()
      });
    });

    // Actualizar métricas de rendimiento
    const performanceMetric: PerformanceMetrics = {
      cpu: this.metrics.get('cpu_usage')?.value || 25,
      memory: this.metrics.get('memory_usage')?.value || 45,
      disk: this.metrics.get('disk_usage')?.value || 35,
      network: Math.random() * 100,
      apiCalls: Math.floor(Math.random() * 1000) + 500,
      responseTime: this.metrics.get('api_response_time')?.value || 45,
      errorRate: this.metrics.get('error_rate')?.value || 0.1,
      timestamp: new Date()
    };

    this.performanceHistory.push(performanceMetric);
    
    // Mantener solo los últimos 100 registros
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }

  private checkThresholds(): void {
    this.metrics.forEach((metric) => {
      const previousStatus = metric.status;
      let newStatus: 'healthy' | 'warning' | 'critical' = 'healthy';

      if (metric.value >= metric.threshold.critical) {
        newStatus = 'critical';
      } else if (metric.value >= metric.threshold.warning) {
        newStatus = 'warning';
      }

      if (newStatus !== previousStatus && newStatus !== 'healthy') {
        this.createAlert({
          type: 'system',
          severity: newStatus === 'critical' ? 'critical' : 'medium',
          title: `Umbral ${newStatus === 'critical' ? 'crítico' : 'de advertencia'} alcanzado`,
          message: `${metric.name} está en ${metric.value}${metric.unit}, superando el umbral ${newStatus === 'critical' ? 'crítico' : 'de advertencia'} de ${metric.threshold[newStatus === 'critical' ? 'critical' : 'warning']}${metric.unit}`,
          source: metric.id,
          metadata: { metricId: metric.id, value: metric.value, threshold: metric.threshold }
        });
      }

      // Actualizar estado de la métrica
      this.metrics.set(metric.id, {
        ...metric,
        status: newStatus
      });
    });
  }

  private updateSystemHealth(): void {
    // Calcular salud general basada en las métricas
    const metricsArray = Array.from(this.metrics.values());
    const criticalCount = metricsArray.filter(m => m.status === 'critical').length;
    const warningCount = metricsArray.filter(m => m.status === 'warning').length;

    let overallHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (criticalCount > 0) {
      overallHealth = 'critical';
    } else if (warningCount > 0) {
      overallHealth = 'warning';
    }

    // Simular salud de componentes
    const components = {
      api: Math.random() > 0.1 ? 'healthy' : 'warning' as 'healthy' | 'warning' | 'critical',
      database: Math.random() > 0.05 ? 'healthy' : 'critical' as 'healthy' | 'warning' | 'critical',
      storage: Math.random() > 0.15 ? 'healthy' : 'warning' as 'healthy' | 'warning' | 'critical',
      network: Math.random() > 0.08 ? 'healthy' : 'warning' as 'healthy' | 'warning' | 'critical'
    };

    this.systemHealth = {
      overall: overallHealth,
      components,
      uptime: 99.9 + (Math.random() - 0.5) * 0.2,
      responseTime: this.metrics.get('api_response_time')?.value || 45,
      errorRate: this.metrics.get('error_rate')?.value || 0.1,
      lastUpdated: new Date()
    };
  }

  // Crear alerta
  createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'status'>): Alert {
    const alert: Alert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: 'active'
    };

    this.alerts.unshift(alert);
    
    // Mantener solo los últimos 1000 alertas
    if (this.alerts.length > 1000) {
      this.alerts.pop();
    }

    // Notificar callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    });

    return alert;
  }

  // Suscribirse a alertas
  onAlert(callback: (alert: Alert) => void): () => void {
    this.alertCallbacks.push(callback);
    
    // Retornar función para cancelar suscripción
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  // Reconocer alerta
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && alert.status === 'active') {
      alert.status = 'acknowledged';
      alert.acknowledgedBy = acknowledgedBy;
      return true;
    }
    return false;
  }

  // Resolver alerta
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && (alert.status === 'active' || alert.status === 'acknowledged')) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
      return true;
    }
    return false;
  }

  // Getters
  getAllMetrics(): SystemMetric[] {
    return Array.from(this.metrics.values());
  }

  getMetric(id: string): SystemMetric | undefined {
    return this.metrics.get(id);
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.status === 'active');
  }

  getAllAlerts(): Alert[] {
    return this.alerts;
  }

  getSystemHealth(): SystemHealth {
    return this.systemHealth;
  }

  getPerformanceHistory(): PerformanceMetrics[] {
    return this.performanceHistory;
  }

  // Métricas personalizadas
  recordCustomMetric(name: string, value: number, unit: string = ''): void {
    const id = `custom_${name.toLowerCase().replace(/\s+/g, '_')}`;
    const metric: SystemMetric = {
      id,
      name,
      value,
      unit,
      status: 'healthy',
      threshold: { warning: value * 1.5, critical: value * 2 },
      trend: 'stable',
      timestamp: new Date()
    };

    this.metrics.set(id, metric);
  }

  // Eventos de negocio
  recordUserSignup(userId: string): void {
    this.recordCustomMetric('Registros de Usuario', 1, 'usuarios');
    
    // Incrementar métrica de usuarios activos
    const activeUsersMetric = this.metrics.get('active_users');
    if (activeUsersMetric) {
      this.metrics.set('active_users', {
        ...activeUsersMetric,
        value: activeUsersMetric.value + 1,
        timestamp: new Date()
      });
    }
  }

  recordWorkflowExecution(workflowId: string, success: boolean): void {
    this.recordCustomMetric('Ejecuciones de Workflow', 1, 'ejecuciones');
    
    if (!success) {
      this.createAlert({
        type: 'business',
        severity: 'medium',
        title: 'Workflow Falló',
        message: `El workflow ${workflowId} falló durante la ejecución`,
        source: workflowId,
        metadata: { workflowId, success }
      });
    }
  }

  recordApiCall(endpoint: string, responseTime: number, success: boolean): void {
    // Actualizar tiempo de respuesta promedio
    const responseTimeMetric = this.metrics.get('api_response_time');
    if (responseTimeMetric) {
      const newAvgResponseTime = (responseTimeMetric.value + responseTime) / 2;
      this.metrics.set('api_response_time', {
        ...responseTimeMetric,
        value: Math.round(newAvgResponseTime * 100) / 100,
        timestamp: new Date()
      });
    }

    // Actualizar tasa de errores
    if (!success) {
      const errorRateMetric = this.metrics.get('error_rate');
      if (errorRateMetric) {
        // Simular incremento en tasa de errores
        const newErrorRate = Math.min(100, errorRateMetric.value + 0.1);
        this.metrics.set('error_rate', {
          ...errorRateMetric,
          value: Math.round(newErrorRate * 100) / 100,
          timestamp: new Date()
        });
      }
    }
  }

  // Limpiar alertas antiguas
  cleanupOldAlerts(daysOld: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffDate);
  }
}

// Instancia singleton del motor de monitoreo
export const monitoringEngine = new MonitoringEngine();

// Función para simular eventos del sistema
export const simulateSystemEvents = () => {
  setInterval(() => {
    // Simular eventos aleatorios
    const events = [
      () => monitoringEngine.recordUserSignup(`user_${Date.now()}`),
      () => monitoringEngine.recordWorkflowExecution(`workflow_${Date.now()}`, Math.random() > 0.1),
      () => monitoringEngine.recordApiCall('/api/workflows', Math.random() * 200 + 20, Math.random() > 0.05)
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();
  }, 10000); // Cada 10 segundos
};

// Iniciar simulación de eventos
simulateSystemEvents();
