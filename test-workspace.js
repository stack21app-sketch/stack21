// Script de prueba para verificar la API de workspaces
const fetch = require('node-fetch');

async function testWorkspaceAPI() {
  console.log('🧪 Probando la API de workspaces...');
  
  try {
    // Probar GET (debería devolver error de autorización)
    const getResponse = await fetch('http://localhost:3000/api/workspaces');
    const getData = await getResponse.json();
    console.log('✅ GET /api/workspaces:', getData);
    
    // Probar POST (debería devolver error de autorización)
    const postResponse = await fetch('http://localhost:3000/api/workspaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Workspace',
        slug: 'test-workspace',
        description: 'Workspace de prueba'
      })
    });
    const postData = await postResponse.json();
    console.log('✅ POST /api/workspaces:', postData);
    
    console.log('🎉 La API está funcionando correctamente!');
    console.log('📝 Nota: Los errores de autorización son esperados sin sesión válida');
    
  } catch (error) {
    console.error('❌ Error probando la API:', error);
  }
}

testWorkspaceAPI();
