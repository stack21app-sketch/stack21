// Sistema de Respaldos Automáticos para Stack21
export interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  source: string[];
  destination: string;
  schedule: BackupSchedule;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  size?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface BackupSchedule {
  type: 'manual' | 'daily' | 'weekly' | 'monthly' | 'custom';
  time?: string; // HH:MM format
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  interval?: number; // minutes for custom
  enabled: boolean;
}

export interface BackupStorage {
  id: string;
  name: string;
  type: 'local' | 's3' | 'gcs' | 'azure' | 'ftp';
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
}

export interface BackupHistory {
  id: string;
  jobId: string;
  status: 'completed' | 'failed' | 'cancelled';
  size: number;
  duration: number; // seconds
  createdAt: Date;
  error?: string;
}

class BackupEngine {
  private jobs: Map<string, BackupJob> = new Map();
  private storage: Map<string, BackupStorage> = new Map();
  private history: BackupHistory[] = [];
  private runningJobs: Set<string> = new Set();

  constructor() {
    this.initializeDefaultStorage();
    this.initializeDefaultJobs();
    this.startScheduler();
  }

  private initializeDefaultStorage(): void {
    const defaultStorage: BackupStorage = {
      id: 'local_storage',
      name: 'Almacenamiento Local',
      type: 'local',
      config: {
        path: './backups',
        maxSize: '10GB',
        retention: '30 days'
      },
      status: 'active',
      createdAt: new Date()
    };

    this.storage.set(defaultStorage.id, defaultStorage);
  }

  private initializeDefaultJobs(): void {
    const defaultJobs: Omit<BackupJob, 'id' | 'createdAt'>[] = [
      {
        name: 'Respaldo Diario de Base de Datos',
        type: 'full',
        status: 'pending',
        source: ['database'],
        destination: 'local_storage',
        schedule: {
          type: 'daily',
          time: '02:00',
          enabled: true
        }
      },
      {
        name: 'Respaldo Semanal Completo',
        type: 'full',
        status: 'pending',
        source: ['database', 'uploads', 'logs'],
        destination: 'local_storage',
        schedule: {
          type: 'weekly',
          time: '01:00',
          dayOfWeek: 0, // Sunday
          enabled: true
        }
      },
      {
        name: 'Respaldo Incremental de Archivos',
        type: 'incremental',
        status: 'pending',
        source: ['uploads'],
        destination: 'local_storage',
        schedule: {
          type: 'custom',
          interval: 360, // 6 hours
          enabled: true
        }
      }
    ];

    defaultJobs.forEach(job => {
      const backupJob: BackupJob = {
        ...job,
        id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };
      this.jobs.set(backupJob.id, backupJob);
    });
  }

  private startScheduler(): void {
    // Verificar trabajos programados cada minuto
    setInterval(() => {
      this.checkScheduledJobs();
    }, 60000);
  }

  private checkScheduledJobs(): void {
    const now = new Date();
    
    this.jobs.forEach((job) => {
      if (!job.schedule.enabled || job.status === 'running') {
        return;
      }

      const shouldRun = this.shouldRunJob(job, now);
      if (shouldRun) {
        this.executeBackupJob(job.id);
      }
    });
  }

  private shouldRunJob(job: BackupJob, now: Date): boolean {
    const { schedule } = job;
    
    switch (schedule.type) {
      case 'manual':
        return false;
      
      case 'daily':
        if (!schedule.time) return false;
        const [hours, minutes] = schedule.time.split(':').map(Number);
        const scheduledTime = new Date(now);
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // Verificar si ya se ejecutó hoy
        const lastRun = this.getLastRunTime(job.id);
        return now >= scheduledTime && (!lastRun || lastRun.toDateString() !== now.toDateString());
      
      case 'weekly':
        if (!schedule.time || schedule.dayOfWeek === undefined) return false;
        const [weeklyHours, weeklyMinutes] = schedule.time.split(':').map(Number);
        const weeklyScheduledTime = new Date(now);
        weeklyScheduledTime.setHours(weeklyHours, weeklyMinutes, 0, 0);
        
        return now.getDay() === schedule.dayOfWeek && 
               now >= weeklyScheduledTime && 
               (!this.getLastRunTime(job.id) || this.getLastRunTime(job.id)!.getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      case 'monthly':
        if (!schedule.time || !schedule.dayOfMonth) return false;
        const [monthlyHours, monthlyMinutes] = schedule.time.split(':').map(Number);
        const monthlyScheduledTime = new Date(now);
        monthlyScheduledTime.setHours(monthlyHours, monthlyMinutes, 0, 0);
        
        return now.getDate() === schedule.dayOfMonth && 
               now >= monthlyScheduledTime &&
               (!this.getLastRunTime(job.id) || this.getLastRunTime(job.id)!.getTime() < now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      case 'custom':
        if (!schedule.interval) return false;
        const customLastRun = this.getLastRunTime(job.id);
        return !customLastRun || (now.getTime() - customLastRun.getTime()) >= schedule.interval * 60 * 1000;
      
      default:
        return false;
    }
  }

  private getLastRunTime(jobId: string): Date | null {
    const jobHistory = this.history
      .filter(h => h.jobId === jobId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return jobHistory.length > 0 ? jobHistory[0].createdAt : null;
  }

  // Crear trabajo de respaldo
  createBackupJob(jobData: Omit<BackupJob, 'id' | 'createdAt' | 'status'>): BackupJob {
    const job: BackupJob = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date()
    };

    this.jobs.set(job.id, job);
    return job;
  }

  // Ejecutar trabajo de respaldo
  async executeBackupJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Backup job ${jobId} not found`);
    }

    if (job.status === 'running') {
      throw new Error(`Backup job ${jobId} is already running`);
    }

    if (this.runningJobs.has(jobId)) {
      throw new Error(`Backup job ${jobId} is already running`);
    }

    this.runningJobs.add(jobId);
    
    try {
      // Actualizar estado del trabajo
      job.status = 'running';
      job.startedAt = new Date();
      this.jobs.set(jobId, job);

      // Simular proceso de respaldo
      const success = await this.performBackup(job);
      
      if (success) {
        job.status = 'completed';
        job.completedAt = new Date();
        job.size = this.calculateBackupSize(job);
        
        // Registrar en historial
        const historyEntry: BackupHistory = {
          id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          jobId,
          status: 'completed',
          size: job.size,
          duration: Math.floor((job.completedAt.getTime() - job.startedAt!.getTime()) / 1000),
          createdAt: new Date()
        };
        
        this.history.unshift(historyEntry);
        
        // Mantener solo los últimos 1000 registros
        if (this.history.length > 1000) {
          this.history.pop();
        }
      } else {
        job.status = 'failed';
        job.error = 'Backup process failed';
      }

      this.jobs.set(jobId, job);
      return success;
      
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      this.jobs.set(jobId, job);
      
      // Registrar fallo en historial
      const historyEntry: BackupHistory = {
        id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        jobId,
        status: 'failed',
        size: 0,
        duration: 0,
        createdAt: new Date(),
        error: job.error
      };
      
      this.history.unshift(historyEntry);
      
      return false;
    } finally {
      this.runningJobs.delete(jobId);
    }
  }

  private async performBackup(job: BackupJob): Promise<boolean> {
    // Simular proceso de respaldo
    const backupDuration = Math.random() * 30 + 10; // 10-40 segundos
    await this.delay(backupDuration * 1000);

    // Simular fallo ocasional (5% de probabilidad)
    if (Math.random() < 0.05) {
      return false;
    }

    return true;
  }

  private calculateBackupSize(job: BackupJob): number {
    // Simular tamaño de respaldo basado en el tipo y fuentes
    let baseSize = 0;
    
    job.source.forEach(source => {
      switch (source) {
        case 'database':
          baseSize += Math.random() * 500 + 100; // 100-600 MB
          break;
        case 'uploads':
          baseSize += Math.random() * 1000 + 200; // 200-1200 MB
          break;
        case 'logs':
          baseSize += Math.random() * 100 + 50; // 50-150 MB
          break;
        default:
          baseSize += Math.random() * 200 + 50; // 50-250 MB
      }
    });

    // Ajustar por tipo de respaldo
    switch (job.type) {
      case 'full':
        return Math.round(baseSize);
      case 'incremental':
        return Math.round(baseSize * 0.1); // 10% del tamaño completo
      case 'differential':
        return Math.round(baseSize * 0.3); // 30% del tamaño completo
      default:
        return Math.round(baseSize);
    }
  }

  // Agregar almacenamiento
  addStorage(storageData: Omit<BackupStorage, 'id' | 'createdAt'>): BackupStorage {
    const storage: BackupStorage = {
      ...storageData,
      id: `storage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    this.storage.set(storage.id, storage);
    return storage;
  }

  // Cancelar trabajo de respaldo
  cancelBackupJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'running') {
      return false;
    }

    job.status = 'cancelled';
    job.completedAt = new Date();
    this.jobs.set(jobId, job);
    this.runningJobs.delete(jobId);

    // Registrar cancelación en historial
    const historyEntry: BackupHistory = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      jobId,
      status: 'cancelled',
      size: 0,
      duration: job.startedAt ? Math.floor((job.completedAt.getTime() - job.startedAt.getTime()) / 1000) : 0,
      createdAt: new Date()
    };
    
    this.history.unshift(historyEntry);

    return true;
  }

  // Actualizar trabajo de respaldo
  updateBackupJob(jobId: string, updates: Partial<BackupJob>): BackupJob | null {
    const job = this.jobs.get(jobId);
    if (!job) {
      return null;
    }

    const updatedJob = { ...job, ...updates };
    this.jobs.set(jobId, updatedJob);
    return updatedJob;
  }

  // Eliminar trabajo de respaldo
  deleteBackupJob(jobId: string): boolean {
    return this.jobs.delete(jobId);
  }

  // Getters
  getAllJobs(): BackupJob[] {
    return Array.from(this.jobs.values());
  }

  getJob(jobId: string): BackupJob | undefined {
    return this.jobs.get(jobId);
  }

  getAllStorage(): BackupStorage[] {
    return Array.from(this.storage.values());
  }

  getStorage(storageId: string): BackupStorage | undefined {
    return this.storage.get(storageId);
  }

  getBackupHistory(jobId?: string): BackupHistory[] {
    if (jobId) {
      return this.history.filter(h => h.jobId === jobId);
    }
    return this.history;
  }

  getRunningJobs(): BackupJob[] {
    return Array.from(this.jobs.values()).filter(job => job.status === 'running');
  }

  // Estadísticas
  getBackupStats(): {
    totalJobs: number;
    runningJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalSize: number;
    averageDuration: number;
    successRate: number;
  } {
    const jobs = Array.from(this.jobs.values());
    const completedJobs = jobs.filter(job => job.status === 'completed').length;
    const failedJobs = jobs.filter(job => job.status === 'failed').length;
    
    const completedHistory = this.history.filter(h => h.status === 'completed');
    const totalSize = completedHistory.reduce((sum, h) => sum + h.size, 0);
    const averageDuration = completedHistory.length > 0 
      ? completedHistory.reduce((sum, h) => sum + h.duration, 0) / completedHistory.length 
      : 0;
    
    const successRate = this.history.length > 0 
      ? (completedHistory.length / this.history.length) * 100 
      : 100;

    return {
      totalJobs: jobs.length,
      runningJobs: this.runningJobs.size,
      completedJobs,
      failedJobs,
      totalSize: Math.round(totalSize),
      averageDuration: Math.round(averageDuration),
      successRate: Math.round(successRate * 100) / 100
    };
  }

  // Limpiar historial antiguo
  cleanupHistory(daysOld: number = 90): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    this.history = this.history.filter(entry => entry.createdAt > cutoffDate);
  }

  // Utilidades
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instancia singleton del motor de respaldos
export const backupEngine = new BackupEngine();

// Función para crear trabajos de respaldo de ejemplo
export const createSampleBackupJobs = (): void => {
  // Ya están creados en el constructor
};
