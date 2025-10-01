'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Pause,
  Trash2,
  Settings,
  Calendar,
  HardDrive,
  Shield,
  Archive,
  RefreshCw,
  Eye,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getBackups, 
  getRestores, 
  getSchedules, 
  getBackupStats,
  createBackup,
  createRestore,
  createSchedule,
  executeBackup,
  executeRestore,
  deleteBackup,
  deleteSchedule,
  availableModules,
  formatBytes,
  calculateCompressionRatio,
  generateBackupName,
  type Backup,
  type Restore,
  type BackupSchedule,
  type BackupStats
} from '@/lib/backup-restore';

export function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [restores, setRestores] = useState<Restore[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [isCreateBackupOpen, setIsCreateBackupOpen] = useState(false);
  const [isCreateRestoreOpen, setIsCreateRestoreOpen] = useState(false);
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const { toast } = useToast();

  const [newBackup, setNewBackup] = useState({
    name: '',
    description: '',
    modules: [] as string[],
    storageLocation: 'local' as 'local' | 's3' | 'gcs' | 'azure',
    compression: true,
    encryption: true
  });

  const [newRestore, setNewRestore] = useState({
    backupId: '',
    modules: [] as string[],
    targetWorkspace: '',
    options: {
      overwriteExisting: false,
      preserveIds: false,
      validateIntegrity: true
    }
  });

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    enabled: true,
    frequency: 'daily' as 'hourly' | 'daily' | 'weekly' | 'monthly',
    time: '02:00',
    dayOfWeek: 0,
    dayOfMonth: 1,
    modules: [] as string[],
    retentionDays: 30,
    storageLocation: 's3' as 'local' | 's3' | 'gcs' | 'azure',
    compression: true,
    encryption: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [backupsData, restoresData, schedulesData, statsData] = await Promise.all([
        getBackups(),
        getRestores(),
        getSchedules(),
        getBackupStats()
      ]);
      
      setBackups(backupsData);
      setRestores(restoresData);
      setSchedules(schedulesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const createNewBackup = async () => {
    if (!newBackup.name || newBackup.modules.length === 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    try {
      const backup = await createBackup({
        name: newBackup.name,
        description: newBackup.description,
        type: 'manual',
        modules: newBackup.modules,
        storageLocation: newBackup.storageLocation,
        storagePath: `/backups/manual/${newBackup.name.toLowerCase().replace(/\s+/g, '_')}.tar.gz`,
        createdBy: 'current_user',
        metadata: {
          compression: newBackup.compression,
          encryption: newBackup.encryption
        }
      });

      setBackups(prev => [backup, ...prev]);
      setNewBackup({
        name: '',
        description: '',
        modules: [],
        storageLocation: 'local',
        compression: true,
        encryption: true
      });
      setIsCreateBackupOpen(false);
      
      toast({
        title: "Backup creado",
        description: "El backup ha sido creado exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el backup",
        variant: "destructive"
      });
    }
  };

  const createNewRestore = async () => {
    if (!newRestore.backupId || newRestore.modules.length === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona un backup y módulos",
        variant: "destructive"
      });
      return;
    }

    try {
      const restore = await createRestore({
        backupId: newRestore.backupId,
        modules: newRestore.modules,
        targetWorkspace: newRestore.targetWorkspace,
        options: newRestore.options,
        createdBy: 'current_user'
      });

      setRestores(prev => [restore, ...prev]);
      setNewRestore({
        backupId: '',
        modules: [],
        targetWorkspace: '',
        options: {
          overwriteExisting: false,
          preserveIds: false,
          validateIntegrity: true
        }
      });
      setIsCreateRestoreOpen(false);
      
      toast({
        title: "Restore creado",
        description: "El restore ha sido creado exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el restore",
        variant: "destructive"
      });
    }
  };

  const createNewSchedule = async () => {
    if (!newSchedule.name || newSchedule.modules.length === 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    try {
      const schedule = await createSchedule({
        ...newSchedule,
        createdBy: 'current_user'
      });

      setSchedules(prev => [...prev, schedule]);
      setNewSchedule({
        name: '',
        description: '',
        enabled: true,
        frequency: 'daily',
        time: '02:00',
        dayOfWeek: 0,
        dayOfMonth: 1,
        modules: [],
        retentionDays: 30,
        storageLocation: 's3',
        compression: true,
        encryption: true
      });
      setIsCreateScheduleOpen(false);
      
      toast({
        title: "Programación creada",
        description: "La programación de backup ha sido creada exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la programación",
        variant: "destructive"
      });
    }
  };

  const executeBackupNow = async (backupId: string) => {
    try {
      const backup = await executeBackup(backupId);
      setBackups(prev => prev.map(b => b.id === backupId ? backup : b));
      
      toast({
        title: "Backup ejecutado",
        description: "El backup se ha ejecutado exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al ejecutar el backup",
        variant: "destructive"
      });
    }
  };

  const executeRestoreNow = async (restoreId: string) => {
    try {
      const restore = await executeRestore(restoreId);
      setRestores(prev => prev.map(r => r.id === restoreId ? restore : r));
      
      toast({
        title: "Restore ejecutado",
        description: "El restore se ha ejecutado exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al ejecutar el restore",
        variant: "destructive"
      });
    }
  };

  const deleteBackupById = async (backupId: string) => {
    try {
      await deleteBackup(backupId);
      setBackups(prev => prev.filter(b => b.id !== backupId));
      
      toast({
        title: "Backup eliminado",
        description: "El backup ha sido eliminado"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el backup",
        variant: "destructive"
      });
    }
  };

  const deleteScheduleById = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      
      toast({
        title: "Programación eliminada",
        description: "La programación ha sido eliminada"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar la programación",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      in_progress: 'secondary',
      pending: 'outline',
      cancelled: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Backups</p>
                  <p className="text-2xl font-bold">{stats.totalBackups}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <HardDrive className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tamaño Total</p>
                  <p className="text-2xl font-bold">{formatBytes(stats.totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tasa de Éxito</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Próximo Backup</p>
                  <p className="text-sm font-bold">
                    {stats.nextScheduled 
                      ? stats.nextScheduled.toLocaleDateString()
                      : 'No programado'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="backups" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="restores">Restores</TabsTrigger>
          <TabsTrigger value="schedules">Programaciones</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestión de Backups</h2>
            <Dialog open={isCreateBackupOpen} onOpenChange={setIsCreateBackupOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Database className="h-4 w-4 mr-2" />
                  Nuevo Backup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Backup</DialogTitle>
                  <DialogDescription>
                    Crea un backup manual de los módulos seleccionados
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backupName">Nombre</Label>
                    <Input
                      id="backupName"
                      value={newBackup.name}
                      onChange={(e) => setNewBackup(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Backup Manual - Septiembre 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupDescription">Descripción</Label>
                    <Input
                      id="backupDescription"
                      value={newBackup.description}
                      onChange={(e) => setNewBackup(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descripción opcional del backup"
                    />
                  </div>
                  <div>
                    <Label>Módulos</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {availableModules.map(moduleItem => (
                        <label key={moduleItem.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newBackup.modules.includes(moduleItem.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewBackup(prev => ({ ...prev, modules: [...prev.modules, moduleItem.id] }));
                              } else {
                                setNewBackup(prev => ({ ...prev, modules: prev.modules.filter(m => m !== moduleItem.id) }));
                              }
                            }}
                          />
                          <span className="text-sm">{moduleItem.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="storageLocation">Ubicación de Almacenamiento</Label>
                      <Select
                        value={newBackup.storageLocation}
                        onValueChange={(value: any) => setNewBackup(prev => ({ ...prev, storageLocation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="s3">Amazon S3</SelectItem>
                          <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                          <SelectItem value="azure">Azure Blob Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="compression"
                          checked={newBackup.compression}
                          onCheckedChange={(checked) => setNewBackup(prev => ({ ...prev, compression: checked }))}
                        />
                        <Label htmlFor="compression">Compresión</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="encryption"
                          checked={newBackup.encryption}
                          onCheckedChange={(checked) => setNewBackup(prev => ({ ...prev, encryption: checked }))}
                        />
                        <Label htmlFor="encryption">Encriptación</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateBackupOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={createNewBackup}>
                      Crear Backup
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {backups.map(backup => (
              <Card key={backup.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(backup.status)}
                        <h3 className="text-lg font-semibold">{backup.name}</h3>
                        {getStatusBadge(backup.status)}
                      </div>
                      {backup.description && (
                        <p className="text-gray-600 mb-2">{backup.description}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Tipo:</span> {backup.type}
                        </div>
                        <div>
                          <span className="font-medium">Tamaño:</span> {backup.size ? formatBytes(backup.size) : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Compresión:</span> {backup.compressedSize ? calculateCompressionRatio(backup.size || 0, backup.compressedSize) : 0}%
                        </div>
                        <div>
                          <span className="font-medium">Creado:</span> {backup.createdAt.toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-sm">Módulos:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {backup.modules.map(moduleId => {
                            const moduleItem = availableModules.find(m => m.id === moduleId);
                            return (
                              <Badge key={moduleId} variant="outline" className="text-xs">
                                {moduleItem?.name || moduleId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {backup.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => executeBackupNow(backup.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Ejecutar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBackup(backup)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteBackupById(backup.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restores" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Historial de Restores</h2>
            <Dialog open={isCreateRestoreOpen} onOpenChange={setIsCreateRestoreOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Nuevo Restore
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Restore</DialogTitle>
                  <DialogDescription>
                    Restaura datos desde un backup existente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="restoreBackup">Backup</Label>
                    <Select
                      value={newRestore.backupId}
                      onValueChange={(value) => setNewRestore(prev => ({ ...prev, backupId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un backup" />
                      </SelectTrigger>
                      <SelectContent>
                        {backups.filter(b => b.status === 'completed').map(backup => (
                          <SelectItem key={backup.id} value={backup.id}>
                            {backup.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Módulos a Restaurar</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {newRestore.backupId && backups.find(b => b.id === newRestore.backupId)?.modules.map(moduleId => {
                        const moduleItem = availableModules.find(m => m.id === moduleId);
                        return (
                          <label key={moduleId} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newRestore.modules.includes(moduleId)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRestore(prev => ({ ...prev, modules: [...prev.modules, moduleId] }));
                                } else {
                                  setNewRestore(prev => ({ ...prev, modules: prev.modules.filter(m => m !== moduleId) }));
                                }
                              }}
                            />
                            <span className="text-sm">{moduleItem?.name || moduleId}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="targetWorkspace">Workspace Destino</Label>
                    <Input
                      id="targetWorkspace"
                      value={newRestore.targetWorkspace}
                      onChange={(e) => setNewRestore(prev => ({ ...prev, targetWorkspace: e.target.value }))}
                      placeholder="ID del workspace destino (opcional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="overwriteExisting"
                        checked={newRestore.options.overwriteExisting}
                        onCheckedChange={(checked) => setNewRestore(prev => ({ 
                          ...prev, 
                          options: { ...prev.options, overwriteExisting: checked }
                        }))}
                      />
                      <Label htmlFor="overwriteExisting">Sobrescribir existentes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preserveIds"
                        checked={newRestore.options.preserveIds}
                        onCheckedChange={(checked) => setNewRestore(prev => ({ 
                          ...prev, 
                          options: { ...prev.options, preserveIds: checked }
                        }))}
                      />
                      <Label htmlFor="preserveIds">Preservar IDs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="validateIntegrity"
                        checked={newRestore.options.validateIntegrity}
                        onCheckedChange={(checked) => setNewRestore(prev => ({ 
                          ...prev, 
                          options: { ...prev.options, validateIntegrity: checked }
                        }))}
                      />
                      <Label htmlFor="validateIntegrity">Validar integridad</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateRestoreOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={createNewRestore}>
                      Crear Restore
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {restores.map(restore => {
              const backup = backups.find(b => b.id === restore.backupId);
              return (
                <Card key={restore.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(restore.status)}
                          <h3 className="text-lg font-semibold">
                            Restore desde: {backup?.name || 'Backup no encontrado'}
                          </h3>
                          {getStatusBadge(restore.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Módulos:</span> {restore.modules.length}
                          </div>
                          <div>
                            <span className="font-medium">Workspace:</span> {restore.targetWorkspace || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Creado:</span> {restore.createdAt.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Completado:</span> {restore.completedAt?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                        {restore.error && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="text-sm text-red-800">{restore.error}</div>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {restore.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => executeRestoreNow(restore.id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Ejecutar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Programaciones de Backup</h2>
            <Dialog open={isCreateScheduleOpen} onOpenChange={setIsCreateScheduleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Nueva Programación
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Programación de Backup</DialogTitle>
                  <DialogDescription>
                    Programa backups automáticos recurrentes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="scheduleName">Nombre</Label>
                    <Input
                      id="scheduleName"
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Backup Diario Completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduleDescription">Descripción</Label>
                    <Input
                      id="scheduleDescription"
                      value={newSchedule.description}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descripción opcional de la programación"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequency">Frecuencia</Label>
                      <Select
                        value={newSchedule.frequency}
                        onValueChange={(value: any) => setNewSchedule(prev => ({ ...prev, frequency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Cada hora</SelectItem>
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="time">Hora</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Módulos</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {availableModules.map(moduleItem => (
                        <label key={moduleItem.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newSchedule.modules.includes(moduleItem.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewSchedule(prev => ({ ...prev, modules: [...prev.modules, moduleItem.id] }));
                              } else {
                                setNewSchedule(prev => ({ ...prev, modules: prev.modules.filter(m => m !== moduleItem.id) }));
                              }
                            }}
                          />
                          <span className="text-sm">{moduleItem.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="retentionDays">Días de Retención</Label>
                      <Input
                        id="retentionDays"
                        type="number"
                        value={newSchedule.retentionDays}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, retentionDays: parseInt(e.target.value) || 30 }))}
                        min="1"
                        max="365"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduleStorageLocation">Ubicación de Almacenamiento</Label>
                      <Select
                        value={newSchedule.storageLocation}
                        onValueChange={(value: any) => setNewSchedule(prev => ({ ...prev, storageLocation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="s3">Amazon S3</SelectItem>
                          <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                          <SelectItem value="azure">Azure Blob Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="scheduleEnabled"
                        checked={newSchedule.enabled}
                        onCheckedChange={(checked) => setNewSchedule(prev => ({ ...prev, enabled: checked }))}
                      />
                      <Label htmlFor="scheduleEnabled">Habilitado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="scheduleCompression"
                        checked={newSchedule.compression}
                        onCheckedChange={(checked) => setNewSchedule(prev => ({ ...prev, compression: checked }))}
                      />
                      <Label htmlFor="scheduleCompression">Compresión</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="scheduleEncryption"
                        checked={newSchedule.encryption}
                        onCheckedChange={(checked) => setNewSchedule(prev => ({ ...prev, encryption: checked }))}
                      />
                      <Label htmlFor="scheduleEncryption">Encriptación</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateScheduleOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={createNewSchedule}>
                      Crear Programación
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {schedules.map(schedule => (
              <Card key={schedule.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">{schedule.name}</h3>
                        <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
                          {schedule.enabled ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      {schedule.description && (
                        <p className="text-gray-600 mb-2">{schedule.description}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Frecuencia:</span> {schedule.frequency}
                        </div>
                        <div>
                          <span className="font-medium">Hora:</span> {schedule.time}
                        </div>
                        <div>
                          <span className="font-medium">Retención:</span> {schedule.retentionDays} días
                        </div>
                        <div>
                          <span className="font-medium">Próxima ejecución:</span> {schedule.nextRun?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-sm">Módulos:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {schedule.modules.map(moduleId => {
                            const moduleItem = availableModules.find(m => m.id === moduleId);
                            return (
                              <Badge key={moduleId} variant="outline" className="text-xs">
                                {moduleItem?.name || moduleId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteScheduleById(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <h2 className="text-2xl font-bold">Módulos Disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModules.map(moduleItem => {
              const moduleStats = stats?.moduleStats[moduleItem.id];
              return (
                <Card key={moduleItem.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      {moduleItem.name}
                    </CardTitle>
                    <CardDescription>{moduleItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Backups:</span>
                        <span className="font-medium">{moduleStats?.count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tamaño total:</span>
                        <span className="font-medium">{moduleStats ? formatBytes(moduleStats.totalSize) : '0 Bytes'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Último backup:</span>
                        <span className="font-medium">
                          {moduleStats?.lastBackup?.toLocaleDateString() || 'Nunca'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

