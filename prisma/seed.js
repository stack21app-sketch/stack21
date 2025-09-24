const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    // Crear datos de ejemplo si no existen
    const userCount = await prisma.user.count();
    console.log(`👥 Usuarios existentes: ${userCount}`);

    const workspaceCount = await prisma.workspace.count();
    console.log(`🏢 Workspaces existentes: ${workspaceCount}`);

    // Crear usuario de ejemplo si no hay usuarios
    if (userCount === 0) {
      console.log('📝 Creando usuario de ejemplo...');
      const exampleUser = await prisma.user.create({
        data: {
          email: 'demo@example.com',
          name: 'Usuario Demo',
          image: 'https://via.placeholder.com/150',
        },
      });
      console.log('✅ Usuario de ejemplo creado:', exampleUser.email);
    }

    // Crear workspace de ejemplo si no hay workspaces
    if (workspaceCount === 0) {
      console.log('📝 Creando workspace de ejemplo...');
      const exampleWorkspace = await prisma.workspace.create({
        data: {
          name: 'Workspace Demo',
          slug: 'workspace-demo',
          description: 'Workspace de demostración para la plataforma SaaS',
          creatorId: (await prisma.user.findFirst())?.id || 'demo-user',
        },
      });
      console.log('✅ Workspace de ejemplo creado:', exampleWorkspace.name);
    }

    console.log('🎉 Seed completado exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - Usuarios: ${await prisma.user.count()}`);
    console.log(`   - Workspaces: ${await prisma.workspace.count()}`);
    console.log(`   - Miembros: ${await prisma.workspaceMember.count()}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  });
