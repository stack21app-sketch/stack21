import { NextRequest, NextResponse } from 'next/server'
import { monitoringEngine } from '@/lib/monitoring-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'metrics') {
      const metrics = monitoringEngine.getAllMetrics();
      return NextResponse.json({ metrics });
    } else if (type === 'alerts') {
      const alerts = monitoringEngine.getAllAlerts();
      return NextResponse.json({ alerts });
    } else if (type === 'active-alerts') {
      const activeAlerts = monitoringEngine.getActiveAlerts();
      return NextResponse.json({ alerts: activeAlerts });
    } else if (type === 'health') {
      const health = monitoringEngine.getSystemHealth();
      return NextResponse.json({ health });
    } else if (type === 'performance') {
      const performance = monitoringEngine.getPerformanceHistory();
      return NextResponse.json({ performance });
    }

    // Por defecto, retornar resumen completo
    const metrics = monitoringEngine.getAllMetrics();
    const activeAlerts = monitoringEngine.getActiveAlerts();
    const health = monitoringEngine.getSystemHealth();
    const performance = monitoringEngine.getPerformanceHistory().slice(-10); // Últimos 10 registros

    return NextResponse.json({
      metrics,
      activeAlerts,
      health,
      performance
    });
  } catch (error) {
    console.error('Error in monitoring API:', error);
    return NextResponse.json({ error: 'Failed to fetch monitoring data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'alert') {
      const alert = monitoringEngine.createAlert(data);
      return NextResponse.json({ alert }, { status: 201 });
    } else if (type === 'acknowledge-alert') {
      const { alertId, acknowledgedBy } = data;
      const success = monitoringEngine.acknowledgeAlert(alertId, acknowledgedBy);
      return NextResponse.json({ success });
    } else if (type === 'resolve-alert') {
      const { alertId } = data;
      const success = monitoringEngine.resolveAlert(alertId);
      return NextResponse.json({ success });
    } else if (type === 'custom-metric') {
      const { name, value, unit } = data;
      monitoringEngine.recordCustomMetric(name, value, unit);
      return NextResponse.json({ success: true });
    } else if (type === 'user-signup') {
      const { userId } = data;
      monitoringEngine.recordUserSignup(userId);
      return NextResponse.json({ success: true });
    } else if (type === 'workflow-execution') {
      const { workflowId, success } = data;
      monitoringEngine.recordWorkflowExecution(workflowId, success);
      return NextResponse.json({ success: true });
    } else if (type === 'api-call') {
      const { endpoint, responseTime, success } = data;
      monitoringEngine.recordApiCall(endpoint, responseTime, success);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error in monitoring POST:', error);
    return NextResponse.json({ error: 'Failed to process monitoring request' }, { status: 500 });
  }
}
