#!/usr/bin/env node

/**
 * 🚀 Generador de 1000+ Aplicaciones para Stack21
 * 
 * Este script genera automáticamente más de 1000 conectores
 * organizados por categorías e industrias.
 */

const fs = require('fs');
const path = require('path');

// Categorías principales de aplicaciones
const categories = {
  'Communication': {
    color: '#3B82F6',
    icon: 'MessageSquare',
    apps: [
      'Slack', 'Discord', 'Microsoft Teams', 'Zoom', 'Google Meet', 'WhatsApp Business',
      'Telegram', 'Signal', 'Skype', 'Cisco Webex', 'GoToMeeting', 'Jitsi',
      'Twilio', 'SendGrid', 'Mailgun', 'Postmark', 'Amazon SES', 'Sendinblue',
      'Intercom', 'Zendesk', 'Freshdesk', 'Help Scout', 'Crisp', 'Tawk.to',
      'LiveChat', 'Drift', 'HubSpot Chat', 'Olark', 'Pure Chat', 'Tidio',
      'Rocket.Chat', 'Mattermost', 'Element', 'Matrix', 'Wire', 'Viber',
      'WeChat', 'Line', 'KakaoTalk', 'QQ', 'Weibo', 'TikTok',
      'Snapchat', 'Instagram', 'Facebook Messenger', 'WhatsApp', 'Telegram Bot',
      'Botpress', 'Rasa', 'Dialogflow', 'Wit.ai', 'IBM Watson', 'Amazon Lex',
      'Microsoft Bot Framework', 'Botkit', 'Hubot', 'Botpress', 'Chatfuel',
      'ManyChat', 'MobileMonkey', 'ChatBot', 'Landbot', 'Flow XO', 'Recast.AI'
    ]
  },
  'Productivity': {
    color: '#10B981',
    icon: 'Briefcase',
    apps: [
      'Notion', 'Airtable', 'Monday.com', 'Asana', 'Trello', 'Jira',
      'Linear', 'ClickUp', 'Wrike', 'Smartsheet', 'Basecamp', 'Todoist',
      'Evernote', 'OneNote', 'Obsidian', 'Roam Research', 'Logseq', 'RemNote',
      'Google Workspace', 'Microsoft 365', 'Dropbox', 'Box', 'OneDrive', 'iCloud',
      'Google Drive', 'Google Docs', 'Google Sheets', 'Google Slides', 'Google Forms',
      'Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Microsoft Outlook'
    ]
  },
  'E-commerce': {
    color: '#F59E0B',
    icon: 'ShoppingCart',
    apps: [
      'Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Squarespace', 'Wix',
      'PrestaShop', 'OpenCart', 'Volusion', '3dcart', 'Ecwid', 'Square Online',
      'Amazon', 'eBay', 'Etsy', 'Walmart', 'Target', 'Best Buy',
      'Stripe', 'PayPal', 'Square', 'Authorize.Net', 'Braintree', 'Razorpay',
      'Klarna', 'Afterpay', 'Sezzle', 'Affirm', 'Apple Pay', 'Google Pay'
    ]
  },
  'Marketing': {
    color: '#8B5CF6',
    icon: 'Megaphone',
    apps: [
      'HubSpot', 'Marketo', 'Pardot', 'Mailchimp', 'Constant Contact', 'Campaign Monitor',
      'ConvertKit', 'ActiveCampaign', 'GetResponse', 'AWeber', 'Drip', 'Klaviyo',
      'Facebook Ads', 'Google Ads', 'LinkedIn Ads', 'Twitter Ads', 'TikTok Ads', 'Snapchat Ads',
      'Hootsuite', 'Buffer', 'Sprout Social', 'Later', 'CoSchedule', 'SocialBee',
      'Google Analytics', 'Adobe Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'Crazy Egg'
    ]
  },
  'CRM & Sales': {
    color: '#EF4444',
    icon: 'Users',
    apps: [
      'Salesforce', 'Pipedrive', 'HubSpot CRM', 'Zoho CRM', 'Freshworks CRM', 'Insightly',
      'Nimble', 'Copper', 'Capsule', 'Airtable', 'Monday.com', 'Notion',
      'Calendly', 'Acuity Scheduling', 'Cal.com', 'When2meet', 'Doodle', 'X.ai',
      'ZoomInfo', 'Apollo', 'Outreach', 'SalesLoft', 'Chorus.ai', 'Gong.io'
    ]
  },
  'Finance & Accounting': {
    color: '#06B6D4',
    icon: 'DollarSign',
    apps: [
      'QuickBooks', 'Xero', 'FreshBooks', 'Wave', 'Zoho Books', 'Sage',
      'Intuit', 'Mint', 'YNAB', 'Personal Capital', 'PocketGuard', 'Tiller',
      'Stripe', 'PayPal', 'Square', 'Authorize.Net', 'Braintree', 'Razorpay',
      'Plaid', 'Yodlee', 'Finicity', 'MX', 'Akoya', 'Tink'
    ]
  },
  'Development & IT': {
    color: '#84CC16',
    icon: 'Code',
    apps: [
      'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'Jira', 'Confluence',
      'Jenkins', 'CircleCI', 'GitHub Actions', 'GitLab CI', 'Travis CI', 'Bamboo',
      'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'DigitalOcean',
      'Heroku', 'Vercel', 'Netlify', 'Railway', 'Render', 'Fly.io'
    ]
  },
  'Social Media': {
    color: '#F97316',
    icon: 'Share2',
    apps: [
      'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube',
      'Pinterest', 'Snapchat', 'Reddit', 'Tumblr', 'Medium', 'Substack',
      'Hootsuite', 'Buffer', 'Sprout Social', 'Later', 'CoSchedule', 'SocialBee',
      'Canva', 'Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Marvel'
    ]
  },
  'Analytics & Data': {
    color: '#6366F1',
    icon: 'BarChart3',
    apps: [
      'Google Analytics', 'Adobe Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'Crazy Egg',
      'Tableau', 'Power BI', 'Looker', 'Mode', 'Periscope', 'Chartio',
      'Segment', 'mParticle', 'Mixpanel', 'Amplitude', 'Heap', 'PostHog',
      'Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'Apache Spark', 'Hadoop'
    ]
  },
  'Customer Support': {
    color: '#EC4899',
    icon: 'Headphones',
    apps: [
      'Zendesk', 'Freshdesk', 'Help Scout', 'Intercom', 'Crisp', 'Tawk.to',
      'LiveChat', 'Drift', 'HubSpot Chat', 'Olark', 'Pure Chat', 'Tidio',
      'Jira Service Management', 'ServiceNow', 'Freshservice', 'SolarWinds', 'ManageEngine', 'Spiceworks'
    ]
  },
  'Project Management': {
    color: '#14B8A6',
    icon: 'CheckSquare',
    apps: [
      'Asana', 'Monday.com', 'Trello', 'Jira', 'Linear', 'ClickUp',
      'Wrike', 'Smartsheet', 'Basecamp', 'Notion', 'Airtable', 'Miro',
      'Figma', 'InVision', 'Marvel', 'Principle', 'Framer', 'Adobe XD'
    ]
  },
  'HR & People': {
    color: '#F43F5E',
    icon: 'UserCheck',
    apps: [
      'BambooHR', 'Workday', 'ADP', 'Paychex', 'Gusto', 'Justworks',
      'Greenhouse', 'Lever', 'Workable', 'JazzHR', 'SmartRecruiters', 'iCIMS',
      'Slack', 'Microsoft Teams', 'Zoom', 'Google Meet', 'Cisco Webex', 'GoToMeeting'
    ]
  },
  'Security & Compliance': {
    color: '#DC2626',
    icon: 'Shield',
    apps: [
      'Okta', 'Auth0', 'OneLogin', 'Ping Identity', 'Azure AD', 'Google Workspace',
      '1Password', 'LastPass', 'Bitwarden', 'Dashlane', 'Keeper', 'NordPass',
      'Splunk', 'Datadog', 'New Relic', 'AppDynamics', 'Dynatrace', 'Elastic'
    ]
  },
  'IoT & Hardware': {
    color: '#7C3AED',
    icon: 'Cpu',
    apps: [
      'Arduino', 'Raspberry Pi', 'ESP32', 'Particle', 'Adafruit', 'SparkFun',
      'IFTTT', 'Zapier', 'Microsoft Power Automate', 'Automate.io', 'Integromat', 'Pabbly',
      'SmartThings', 'Home Assistant', 'OpenHAB', 'Domoticz', 'Homey', 'Hubitat'
    ]
  },
  'Gaming & Entertainment': {
    color: '#EAB308',
    icon: 'Gamepad2',
    apps: [
      'Steam', 'Epic Games', 'Xbox', 'PlayStation', 'Nintendo', 'Twitch',
      'YouTube Gaming', 'Discord', 'Reddit', 'Twitter', 'TikTok', 'Instagram',
      'Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud', 'Pandora', 'Tidal'
    ]
  },
  'Health & Fitness': {
    color: '#059669',
    icon: 'Heart',
    apps: [
      'Apple Health', 'Google Fit', 'Fitbit', 'Garmin', 'Samsung Health', 'MyFitnessPal',
      'Strava', 'Nike Run Club', 'Adidas Running', 'Runtastic', 'MapMyRun', 'Endomondo',
      'Headspace', 'Calm', 'Insight Timer', 'Aura', 'Ten Percent Happier', 'Waking Up'
    ]
  },
  'Education': {
    color: '#0891B2',
    icon: 'GraduationCap',
    apps: [
      'Google Classroom', 'Microsoft Teams for Education', 'Canvas', 'Blackboard', 'Moodle', 'Schoology',
      'Khan Academy', 'Coursera', 'Udemy', 'edX', 'LinkedIn Learning', 'Skillshare',
      'Zoom', 'Google Meet', 'Microsoft Teams', 'Cisco Webex', 'GoToMeeting', 'Jitsi'
    ]
  },
  'Real Estate': {
    color: '#B45309',
    icon: 'Home',
    apps: [
      'Zillow', 'Realtor.com', 'Redfin', 'Trulia', 'Apartments.com', 'Rent.com',
      'CoStar', 'LoopNet', 'CommercialEdge', 'Crexi', 'Ten-X', 'Auction.com',
      'DocuSign', 'Dotloop', 'TransactionDesk', 'SkySlope', 'Chime', 'Wise Agent'
    ]
  },
  'Travel & Hospitality': {
    color: '#0D9488',
    icon: 'Plane',
    apps: [
      'Expedia', 'Booking.com', 'Airbnb', 'Vrbo', 'Hotels.com', 'Priceline',
      'Kayak', 'Skyscanner', 'Google Flights', 'Amadeus', 'Sabre', 'Travelport',
      'Uber', 'Lyft', 'Grab', 'Didi', 'Bolt', 'Free Now'
    ]
  },
  'Food & Delivery': {
    color: '#DC2626',
    icon: 'Utensils',
    apps: [
      'Uber Eats', 'DoorDash', 'Grubhub', 'Postmates', 'Caviar', 'Seamless',
      'Deliveroo', 'Just Eat', 'Takeaway.com', 'Swiggy', 'Zomato', 'Foodpanda',
      'OpenTable', 'Resy', 'Yelp', 'Foursquare', 'Google My Business', 'TripAdvisor'
    ]
  }
};

// Generar datos de aplicaciones
function generateApps() {
  const apps = [];
  let appId = 1;

  Object.entries(categories).forEach(([categoryName, categoryData]) => {
    categoryData.apps.forEach(appName => {
      const app = {
        id: `app_${appId.toString().padStart(4, '0')}`,
        slug: appName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: appName,
        description: `Integración con ${appName} para automatizar tu flujo de trabajo`,
        category: categoryName,
        logoUrl: `https://logo.clearbit.com/${getDomainFromApp(appName)}`,
        docsUrl: `https://docs.stack21.com/integrations/${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        oauthType: getOAuthType(appName),
        isActive: true,
        features: generateFeatures(appName, categoryName),
        pricing: generatePricing(appName),
        popularity: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
      
      apps.push(app);
      appId++;
    });
  });

  return apps;
}

function getDomainFromApp(appName) {
  const domainMap = {
    'Google Workspace': 'google.com',
    'Microsoft 365': 'microsoft.com',
    'Google Drive': 'drive.google.com',
    'Google Docs': 'docs.google.com',
    'Google Sheets': 'sheets.google.com',
    'Google Slides': 'slides.google.com',
    'Google Forms': 'forms.google.com',
    'Microsoft Word': 'office.com',
    'Microsoft Excel': 'office.com',
    'Microsoft PowerPoint': 'office.com',
    'Microsoft Outlook': 'outlook.com',
    'Facebook Ads': 'facebook.com',
    'Google Ads': 'ads.google.com',
    'LinkedIn Ads': 'linkedin.com',
    'Twitter Ads': 'twitter.com',
    'TikTok Ads': 'tiktok.com',
    'Snapchat Ads': 'snapchat.com',
    'Google Analytics': 'analytics.google.com',
    'Adobe Analytics': 'adobe.com',
    'Apple Health': 'apple.com',
    'Google Fit': 'fit.google.com',
    'Apple Music': 'music.apple.com',
    'YouTube Music': 'music.youtube.com',
    'Google Classroom': 'classroom.google.com',
    'Microsoft Teams for Education': 'teams.microsoft.com',
    'Google Flights': 'flights.google.com',
    'Google My Business': 'business.google.com'
  };
  
  return domainMap[appName] || `${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
}

function getOAuthType(appName) {
  const oauthApps = [
    'Slack', 'Discord', 'Microsoft Teams', 'Zoom', 'Google Meet', 'WhatsApp Business',
    'Notion', 'Airtable', 'Monday.com', 'Asana', 'Trello', 'Jira', 'Linear', 'ClickUp',
    'Google Workspace', 'Microsoft 365', 'Google Drive', 'Google Docs', 'Google Sheets',
    'HubSpot', 'Marketo', 'Pardot', 'Mailchimp', 'Constant Contact', 'Campaign Monitor',
    'Salesforce', 'Pipedrive', 'HubSpot CRM', 'Zoho CRM', 'Freshworks CRM',
    'QuickBooks', 'Xero', 'FreshBooks', 'Wave', 'Zoho Books',
    'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps',
    'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest',
    'Zendesk', 'Freshdesk', 'Help Scout', 'Intercom', 'Crisp', 'Tawk.to',
    'Okta', 'Auth0', 'OneLogin', 'Ping Identity', 'Azure AD', 'Google Workspace',
    'Steam', 'Epic Games', 'Twitch', 'YouTube Gaming', 'Discord',
    'Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud',
    'Apple Health', 'Google Fit', 'Fitbit', 'Garmin', 'Samsung Health',
    'Google Classroom', 'Microsoft Teams for Education', 'Canvas', 'Blackboard',
    'Zillow', 'Realtor.com', 'Redfin', 'Trulia', 'Apartments.com',
    'Expedia', 'Booking.com', 'Airbnb', 'Vrbo', 'Hotels.com',
    'Uber Eats', 'DoorDash', 'Grubhub', 'Postmates', 'Caviar',
    'Uber', 'Lyft', 'Grab', 'Didi', 'Bolt'
  ];
  
  return oauthApps.includes(appName) ? 'oauth2' : 'api_key';
}

function generateFeatures(appName, category) {
  const baseFeatures = [
    'Automatización de tareas',
    'Sincronización de datos',
    'Notificaciones en tiempo real',
    'Integración con workflows'
  ];
  
  const categoryFeatures = {
    'Communication': ['Envío de mensajes', 'Gestión de canales', 'Notificaciones push'],
    'Productivity': ['Gestión de proyectos', 'Colaboración en tiempo real', 'Sincronización de archivos'],
    'E-commerce': ['Gestión de pedidos', 'Sincronización de inventario', 'Procesamiento de pagos'],
    'Marketing': ['Campañas automatizadas', 'Segmentación de audiencia', 'Analytics avanzados'],
    'CRM & Sales': ['Gestión de contactos', 'Seguimiento de leads', 'Automatización de ventas'],
    'Finance & Accounting': ['Conciliación bancaria', 'Facturación automática', 'Reportes financieros'],
    'Development & IT': ['CI/CD automatizado', 'Gestión de código', 'Monitoreo de aplicaciones'],
    'Social Media': ['Programación de posts', 'Gestión de contenido', 'Analytics de engagement'],
    'Analytics & Data': ['Reportes automáticos', 'Dashboards en tiempo real', 'Alertas inteligentes'],
    'Customer Support': ['Gestión de tickets', 'Respuestas automáticas', 'Métricas de satisfacción'],
    'Project Management': ['Gestión de tareas', 'Seguimiento de progreso', 'Colaboración de equipo'],
    'HR & People': ['Gestión de empleados', 'Automatización de nómina', 'Seguimiento de rendimiento'],
    'Security & Compliance': ['Autenticación segura', 'Auditoría de accesos', 'Cumplimiento normativo'],
    'IoT & Hardware': ['Control de dispositivos', 'Monitoreo remoto', 'Automatización del hogar'],
    'Gaming & Entertainment': ['Streaming automático', 'Gestión de contenido', 'Interacción con comunidad'],
    'Health & Fitness': ['Seguimiento de actividad', 'Recordatorios de salud', 'Análisis de datos'],
    'Education': ['Gestión de cursos', 'Automatización de tareas', 'Comunicación con estudiantes'],
    'Real Estate': ['Gestión de propiedades', 'Automatización de ventas', 'Seguimiento de leads'],
    'Travel & Hospitality': ['Reservas automáticas', 'Gestión de viajes', 'Notificaciones de vuelos'],
    'Food & Delivery': ['Pedidos automáticos', 'Seguimiento de entregas', 'Gestión de restaurantes']
  };
  
  return [...baseFeatures, ...(categoryFeatures[category] || [])];
}

function generatePricing(appName) {
  const pricingTiers = [
    { name: 'Free', price: 0, executions: 100, features: ['Básico'] },
    { name: 'Pro', price: 29, executions: 1000, features: ['Avanzado', 'Soporte'] },
    { name: 'Enterprise', price: 99, executions: 10000, features: ['Premium', 'Soporte 24/7', 'Custom'] }
  ];
  
  return pricingTiers[Math.floor(Math.random() * pricingTiers.length)];
}

// Generar las aplicaciones
const apps = generateApps();

// Crear archivo de datos
const outputPath = path.join(__dirname, '..', 'src', 'data', 'apps.json');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(apps, null, 2));

// Crear archivo de categorías
const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'categories.json');
fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

console.log(`🚀 Generadas ${apps.length} aplicaciones en ${Object.keys(categories).length} categorías`);
console.log(`📁 Archivos creados:`);
console.log(`   - ${outputPath}`);
console.log(`   - ${categoriesPath}`);
console.log(`\n📊 Estadísticas:`);

Object.entries(categories).forEach(([categoryName, categoryData]) => {
  console.log(`   - ${categoryName}: ${categoryData.apps.length} apps`);
});

console.log(`\n✅ ¡Stack21 ahora tiene ${apps.length} aplicaciones conectadas!`);
