import { useState, useEffect } from 'react';

interface Analytics {
  overview: {
    totalWorkflows: number;
    activeWorkflows: number;
    totalExecutions: number;
    successfulExecutions: number;
    successRate: number;
    unreadNotifications: number;
    estimatedSavings: number;
  };
  recent: {
    recentExecutions: number;
    recentSuccessRate: number;
  };
  topWorkflows: Array<{
    id: string;
    name: string;
    executions: number;
    successRate: number;
  }>;
  dailyMetrics: Array<{
    date: string;
    executions: number;
    successful: number;
    failed: number;
  }>;
  trends: {
    workflowGrowth: number;
    executionGrowth: number;
  };
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      } else {
        setError('Error al cargar analytics');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const recordMetric = async (metricName: string, metricValue: number) => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric_name: metricName,
          metric_value: metricValue
        })
      });

      if (response.ok) {
        // Refresh analytics after recording metric
        await fetchAnalytics();
      } else {
        throw new Error('Error al registrar métrica');
      }
    } catch (err) {
      setError('Error al registrar métrica');
      throw err;
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    recordMetric
  };
}
