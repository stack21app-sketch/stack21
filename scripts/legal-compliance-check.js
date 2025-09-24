#!/usr/bin/env node

/**
 * Script de Verificación de Conformidad Legal
 * 
 * Este script verifica automáticamente el estado de conformidad legal
 * de Stack21 y genera un reporte detallado.
 */

const fs = require('fs')
const path = require('path')

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

// Función para imprimir con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Función para verificar archivos de conformidad legal
function checkLegalFiles() {
  const legalFiles = [
    'src/app/privacy-policy/page.tsx',
    'src/app/terms-of-service/page.tsx',
    'src/app/cookie-policy/page.tsx',
    'src/app/legal-compliance/page.tsx',
    'src/components/legal/cookie-banner.tsx',
    'src/components/legal/consent-manager.tsx',
    'src/components/legal/privacy-center.tsx',
    'src/components/legal/compliance-monitor.tsx',
    'src/app/api/legal/consent/route.ts',
    'src/app/api/legal/data-export/route.ts',
    'src/app/api/legal/data-deletion/route.ts',
    'src/app/api/legal/privacy-settings/route.ts',
    'src/lib/legal-compliance.ts',
    'src/lib/cookie-management.ts',
    'src/lib/gdpr-utils.ts',
    'src/__tests__/legal/legal-compliance.test.ts'
  ]

  const results = {
    total: legalFiles.length,
    found: 0,
    missing: [],
    errors: []
  }

  log('\n🔍 Verificando archivos de conformidad legal...', 'blue')

  legalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      results.found++
      log(`  ✅ ${file}`, 'green')
    } else {
      results.missing.push(file)
      log(`  ❌ ${file}`, 'red')
    }
  })

  return results
}

// Función para verificar tests de conformidad
function checkLegalTests() {
  log('\n🧪 Verificando tests de conformidad legal...', 'blue')
  
  try {
    const { execSync } = require('child_process')
    const testOutput = execSync('npm run test:legal', { 
      encoding: 'utf8',
      stdio: 'pipe'
    })
    
    // Extraer estadísticas de los tests
    const testMatch = testOutput.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/)
    if (testMatch) {
      const passed = parseInt(testMatch[1])
      const total = parseInt(testMatch[2])
      const percentage = Math.round((passed / total) * 100)
      
      log(`  ✅ Tests pasando: ${passed}/${total} (${percentage}%)`, 'green')
      return { passed, total, percentage }
    } else {
      log(`  ⚠️  No se pudieron extraer estadísticas de tests`, 'yellow')
      return { passed: 0, total: 0, percentage: 0 }
    }
  } catch (error) {
    log(`  ❌ Error ejecutando tests: ${error.message}`, 'red')
    return { passed: 0, total: 0, percentage: 0 }
  }
}

// Función para verificar integración en CI/CD
function checkCICDIntegration() {
  log('\n🚀 Verificando integración en CI/CD...', 'blue')
  
  const ciFile = path.join(process.cwd(), '.github/workflows/deploy.yml')
  if (fs.existsSync(ciFile)) {
    const ciContent = fs.readFileSync(ciFile, 'utf8')
    
    const hasLegalTests = ciContent.includes('test:legal')
    const hasTestSprite = ciContent.includes('testsprite_tests')
    
    if (hasLegalTests) {
      log(`  ✅ Tests legales integrados en CI/CD`, 'green')
    } else {
      log(`  ❌ Tests legales NO integrados en CI/CD`, 'red')
    }
    
    if (hasTestSprite) {
      log(`  ✅ TestSprite integrado en CI/CD`, 'green')
    } else {
      log(`  ⚠️  TestSprite no encontrado en CI/CD`, 'yellow')
    }
    
    return { hasLegalTests, hasTestSprite }
  } else {
    log(`  ❌ Archivo CI/CD no encontrado`, 'red')
    return { hasLegalTests: false, hasTestSprite: false }
  }
}

// Función para verificar configuración de package.json
function checkPackageConfig() {
  log('\n📦 Verificando configuración de package.json...', 'blue')
  
  const packageFile = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packageFile)) {
    const packageContent = JSON.parse(fs.readFileSync(packageFile, 'utf8'))
    const scripts = packageContent.scripts || {}
    
    const hasLegalTestScript = scripts['test:legal']
    
    if (hasLegalTestScript) {
      log(`  ✅ Script test:legal configurado`, 'green')
    } else {
      log(`  ❌ Script test:legal NO configurado`, 'red')
    }
    
    return { hasLegalTestScript: !!hasLegalTestScript }
  } else {
    log(`  ❌ package.json no encontrado`, 'red')
    return { hasLegalTestScript: false }
  }
}

// Función para generar reporte de conformidad
function generateComplianceReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    overallScore: 0,
    details: results,
    recommendations: []
  }

  // Calcular puntuación general
  let score = 0
  let maxScore = 0

  // Puntuación por archivos (40%)
  maxScore += 40
  score += (results.files.found / results.files.total) * 40

  // Puntuación por tests (30%)
  maxScore += 30
  score += (results.tests.percentage / 100) * 30

  // Puntuación por CI/CD (20%)
  maxScore += 20
  if (results.cicd.hasLegalTests) score += 20

  // Puntuación por configuración (10%)
  maxScore += 10
  if (results.package.hasLegalTestScript) score += 10

  report.overallScore = Math.round(score)

  // Generar recomendaciones
  if (results.files.missing.length > 0) {
    report.recommendations.push('Implementar archivos de conformidad legal faltantes')
  }
  if (results.tests.percentage < 100) {
    report.recommendations.push('Corregir tests de conformidad que están fallando')
  }
  if (!results.cicd.hasLegalTests) {
    report.recommendations.push('Integrar tests legales en el pipeline de CI/CD')
  }
  if (!results.package.hasLegalTestScript) {
    report.recommendations.push('Configurar script de tests legales en package.json')
  }

  return report
}

// Función principal
async function main() {
  log(`${colors.bold}${colors.blue}🔒 VERIFICACIÓN DE CONFORMIDAD LEGAL - STACK21${colors.reset}`)
  log(`${colors.blue}================================================${colors.reset}`)

  const results = {
    files: checkLegalFiles(),
    tests: checkLegalTests(),
    cicd: checkCICDIntegration(),
    package: checkPackageConfig()
  }

  const report = generateComplianceReport(results)

  // Mostrar resumen
  log(`\n${colors.bold}📊 RESUMEN DE CONFORMIDAD${colors.reset}`)
  log(`${colors.blue}========================${colors.reset}`)
  
  log(`\n📁 Archivos de Conformidad: ${results.files.found}/${results.files.total}`)
  log(`🧪 Tests de Conformidad: ${results.tests.passed}/${results.tests.total} (${results.tests.percentage}%)`)
  log(`🚀 CI/CD Integration: ${results.cicd.hasLegalTests ? '✅' : '❌'}`)
  log(`📦 Package Config: ${results.package.hasLegalTestScript ? '✅' : '❌'}`)
  
  log(`\n${colors.bold}🎯 PUNTUACIÓN GENERAL: ${report.overallScore}/100${colors.reset}`)
  
  if (report.overallScore >= 90) {
    log(`\n${colors.green}${colors.bold}🎉 ¡EXCELENTE! Conformidad legal completa${colors.reset}`)
  } else if (report.overallScore >= 70) {
    log(`\n${colors.yellow}${colors.bold}⚠️  BUENO. Hay algunas mejoras pendientes${colors.reset}`)
  } else {
    log(`\n${colors.red}${colors.bold}❌ REQUIERE ATENCIÓN. Implementar conformidad legal${colors.reset}`)
  }

  // Mostrar recomendaciones
  if (report.recommendations.length > 0) {
    log(`\n${colors.bold}💡 RECOMENDACIONES:${colors.reset}`)
    report.recommendations.forEach((rec, index) => {
      log(`  ${index + 1}. ${rec}`)
    })
  }

  // Guardar reporte
  const reportFile = path.join(process.cwd(), 'legal-compliance-report.json')
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
  log(`\n📄 Reporte guardado en: ${reportFile}`)

  // Mostrar archivos faltantes si los hay
  if (results.files.missing.length > 0) {
    log(`\n${colors.red}${colors.bold}❌ ARCHIVOS FALTANTES:${colors.reset}`)
    results.files.missing.forEach(file => {
      log(`  - ${file}`)
    })
  }

  log(`\n${colors.blue}================================================${colors.reset}`)
  log(`${colors.bold}Verificación completada: ${new Date().toLocaleString('es-ES')}${colors.reset}`)

  // Exit code basado en la puntuación
  process.exit(report.overallScore >= 80 ? 0 : 1)
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log(`\n${colors.red}❌ Error durante la verificación: ${error.message}${colors.reset}`)
    process.exit(1)
  })
}

module.exports = { main, checkLegalFiles, checkLegalTests, checkCICDIntegration, checkPackageConfig }
