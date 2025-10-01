// Configuración de OAuth
export const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  },
};

// Verificar si OAuth está configurado
export const isOAuthConfigured = () => {
  return oauthConfig.google.enabled || oauthConfig.github.enabled;
};

// Obtener proveedores disponibles
export const getAvailableProviders = () => {
  const providers = [];
  if (oauthConfig.google.enabled) providers.push('google');
  if (oauthConfig.github.enabled) providers.push('github');
  return providers;
};

// URLs de configuración
export const oauthSetupUrls = {
  google: 'https://console.cloud.google.com/apis/credentials',
  github: 'https://github.com/settings/developers',
};
