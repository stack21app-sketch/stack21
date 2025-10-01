const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectors = [
  {
    id: 'http',
    slug: 'http',
    name: 'HTTP Request',
    description: 'Hacer requests HTTP a cualquier API',
    category: 'Communication',
    oauthType: 'none',
    isActive: true,
  },
  {
    id: 'gmail',
    slug: 'gmail',
    name: 'Gmail',
    description: 'Enviar y recibir emails con Gmail',
    category: 'Communication',
    logoUrl: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    docsUrl: 'https://developers.google.com/gmail/api',
    oauthType: 'oauth2',
    isActive: true,
  },
  {
    id: 'google-sheets',
    slug: 'google-sheets',
    name: 'Google Sheets',
    description: 'Leer y escribir en hojas de cálculo de Google',
    category: 'Productivity',
    logoUrl: 'https://ssl.gstatic.com/docs/spreadsheets/favicon.ico',
    docsUrl: 'https://developers.google.com/sheets/api',
    oauthType: 'oauth2',
    isActive: true,
  },
  {
    id: 'slack',
    slug: 'slack',
    name: 'Slack',
    description: 'Enviar mensajes y interactuar con Slack',
    category: 'Communication',
    logoUrl: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash.png',
    docsUrl: 'https://api.slack.com',
    oauthType: 'oauth2',
    isActive: true,
  },
  {
    id: 'notion',
    slug: 'notion',
    name: 'Notion',
    description: 'Crear y gestionar páginas y bases de datos en Notion',
    category: 'Productivity',
    logoUrl: 'https://www.notion.so/images/logo-ios.png',
    docsUrl: 'https://developers.notion.com',
    oauthType: 'oauth2',
    isActive: true,
  },
  {
    id: 'github',
    slug: 'github',
    name: 'GitHub',
    description: 'Interactuar con repositorios, issues y pull requests de GitHub',
    category: 'Development',
    logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    docsUrl: 'https://docs.github.com/en/rest',
    oauthType: 'oauth2',
    isActive: true,
  },
];

async function seedConnectors() {
  try {
    console.log('🌱 Sembrando conectores...');

    for (const connector of connectors) {
      await prisma.app.upsert({
        where: { slug: connector.slug },
        update: connector,
        create: connector,
      });
      console.log(`✅ Conector ${connector.name} sembrado`);
    }

    console.log('🎉 Todos los conectores han sido sembrados exitosamente');
  } catch (error) {
    console.error('❌ Error sembrando conectores:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedConnectors()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedConnectors };
