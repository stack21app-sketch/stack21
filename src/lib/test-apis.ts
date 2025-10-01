// Utilidades para probar APIs y funcionalidades

export const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data,
      error: response.ok ? null : data.error || 'Error desconocido',
    };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return {
      success: false,
      status: 0,
      data: null,
      error: err?.message || 'Unknown error',
    };
  }
};

// Tests específicos para cada funcionalidad
export const testWorkflows = async () => {
  const result = await testAPI('/workflows');
  return {
    name: 'Workflows API',
    ...result,
    description: 'API para gestionar workflows',
  };
};

export const testAnalytics = async () => {
  const result = await testAPI('/analytics');
  return {
    name: 'Analytics API',
    ...result,
    description: 'API para métricas y analytics',
  };
};

export const testChatbot = async () => {
  const result = await testAPI('/chatbot');
  return {
    name: 'Chatbot API',
    ...result,
    description: 'API para gestionar chatbots',
  };
};

export const testEmails = async () => {
  const result = await testAPI('/emails');
  return {
    name: 'Emails API',
    ...result,
    description: 'API para automatización de emails',
  };
};

export const testNotifications = async () => {
  const result = await testAPI('/notifications');
  return {
    name: 'Notifications API',
    ...result,
    description: 'API para notificaciones',
  };
};

// Función para ejecutar todos los tests
export const runAllTests = async () => {
  const tests = [
    testWorkflows,
    testAnalytics,
    testChatbot,
    testEmails,
    testNotifications,
  ];

  const results = await Promise.all(tests.map(test => test()));
  
  const summary = {
    total: results.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };

  return summary;
};
