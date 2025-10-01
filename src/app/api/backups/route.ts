import { NextRequest, NextResponse } from 'next/server'
import { backupEngine } from '@/lib/backup-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'jobs') {
      const jobs = backupEngine.getAllJobs();
      return NextResponse.json({ jobs });
    } else if (type === 'storage') {
      const storage = backupEngine.getAllStorage();
      return NextResponse.json({ storage });
    } else if (type === 'history') {
      const jobId = searchParams.get('jobId');
      const history = backupEngine.getBackupHistory(jobId || undefined);
      return NextResponse.json({ history });
    } else if (type === 'stats') {
      const stats = backupEngine.getBackupStats();
      return NextResponse.json({ stats });
    } else if (type === 'running') {
      const runningJobs = backupEngine.getRunningJobs();
      return NextResponse.json({ jobs: runningJobs });
    }

    // Por defecto, retornar resumen completo
    const jobs = backupEngine.getAllJobs();
    const storage = backupEngine.getAllStorage();
    const stats = backupEngine.getBackupStats();
    const runningJobs = backupEngine.getRunningJobs();

    return NextResponse.json({
      jobs,
      storage,
      stats,
      runningJobs
    });
  } catch (error) {
    console.error('Error in backups API:', error);
    return NextResponse.json({ error: 'Failed to fetch backup data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'create-job') {
      const job = backupEngine.createBackupJob(data);
      return NextResponse.json({ job }, { status: 201 });
    } else if (type === 'execute-job') {
      const { jobId } = data;
      const success = await backupEngine.executeBackupJob(jobId);
      return NextResponse.json({ success });
    } else if (type === 'cancel-job') {
      const { jobId } = data;
      const success = backupEngine.cancelBackupJob(jobId);
      return NextResponse.json({ success });
    } else if (type === 'update-job') {
      const { jobId, ...updates } = data;
      const job = backupEngine.updateBackupJob(jobId, updates);
      return NextResponse.json({ job });
    } else if (type === 'delete-job') {
      const { jobId } = data;
      const success = backupEngine.deleteBackupJob(jobId);
      return NextResponse.json({ success });
    } else if (type === 'add-storage') {
      const storage = backupEngine.addStorage(data);
      return NextResponse.json({ storage }, { status: 201 });
    } else if (type === 'cleanup-history') {
      const { daysOld = 90 } = data;
      backupEngine.cleanupHistory(daysOld);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error in backups POST:', error);
    return NextResponse.json({ error: 'Failed to process backup request' }, { status: 500 });
  }
}