/**
 * Tests de Conformidad Legal
 * 
 * Este archivo contiene tests para verificar el cumplimiento
 * con regulaciones internacionales de privacidad.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { legalComplianceManager } from '@/lib/legal-compliance'
import { cookieManager } from '@/lib/cookie-management'
import { gdprManager } from '@/lib/gdpr-utils'

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock de document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
})

describe('Conformidad Legal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GDPR Compliance', () => {
    it('debe identificar correctamente regiones GDPR', () => {
      expect(legalComplianceManager.isGDPRRegion('ES')).toBe(true)
      expect(legalComplianceManager.isGDPRRegion('FR')).toBe(true)
      expect(legalComplianceManager.isGDPRRegion('DE')).toBe(true)
      expect(legalComplianceManager.isGDPRRegion('US')).toBe(false)
      expect(legalComplianceManager.isGDPRRegion('CA')).toBe(false)
    })

    it('debe determinar regulaciones aplicables correctamente', () => {
      const euRegulations = legalComplianceManager.getApplicableRegulations('ES')
      expect(euRegulations).toContain('GDPR')

      const usRegulations = legalComplianceManager.getApplicableRegulations('US', 'CA')
      expect(usRegulations).toContain('CCPA')

      const caRegulations = legalComplianceManager.getApplicableRegulations('CA')
      expect(caRegulations).toContain('PIPEDA')

      const brRegulations = legalComplianceManager.getApplicableRegulations('BR')
      expect(brRegulations).toContain('LGPD')
    })

    it('debe validar consentimiento GDPR correctamente', () => {
      const validConsent = {
        id: 'test_consent',
        user_id: 'user_123',
        consent_type: 'analytics' as const,
        granted: true,
        timestamp: new Date().toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        legal_basis: 'Art. 6.1.a GDPR - Consentimiento',
        version: '1.0'
      }

      const validation = legalComplianceManager.validateConsent(validConsent, ['GDPR'])
      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('debe rechazar consentimiento GDPR inválido', () => {
      const invalidConsent = {
        id: 'test_consent',
        user_id: 'user_123',
        consent_type: 'analytics' as const,
        granted: true,
        timestamp: '', // Timestamp faltante
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        legal_basis: '', // Base legal faltante
        version: '1.0'
      }

      const validation = legalComplianceManager.validateConsent(invalidConsent, ['GDPR'])
      expect(validation.valid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
    })

    it('debe crear registro de consentimiento válido', () => {
      const consent = legalComplianceManager.createConsentRecord(
        'user_123',
        'analytics',
        true,
        '192.168.1.1',
        'Mozilla/5.0',
        ['GDPR']
      )

      expect(consent.user_id).toBe('user_123')
      expect(consent.consent_type).toBe('analytics')
      expect(consent.granted).toBe(true)
      expect(consent.legal_basis).toBe('Art. 6.1.a GDPR - Consentimiento')
      expect(consent.timestamp).toBeDefined()
    })

    it('debe calcular períodos de retención correctamente', () => {
      const gdprRetention = legalComplianceManager.getRetentionPeriod('profile_data', ['GDPR'])
      expect(gdprRetention).toBe(730) // 2 años

      const ccpaRetention = legalComplianceManager.getRetentionPeriod('marketing_data', ['CCPA'])
      expect(ccpaRetention).toBe(365) // 1 año
    })

    it('debe determinar si los datos deben eliminarse', () => {
      const oldDate = new Date(Date.now() - 800 * 24 * 60 * 60 * 1000).toISOString() // 800 días
      const recentDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días

      expect(legalComplianceManager.shouldDeleteData('profile_data', oldDate, ['GDPR'])).toBe(true)
      expect(legalComplianceManager.shouldDeleteData('profile_data', recentDate, ['GDPR'])).toBe(false)
    })
  })

  describe('CCPA Compliance', () => {
    it('debe identificar correctamente regiones CCPA', () => {
      expect(legalComplianceManager.isCCPARegion('US', 'CA')).toBe(true)
      expect(legalComplianceManager.isCCPARegion('US', 'NY')).toBe(false)
      expect(legalComplianceManager.isCCPARegion('CA', 'ON')).toBe(false)
    })

    it('debe validar consentimiento CCPA correctamente', () => {
      const validConsent = {
        id: 'test_consent',
        user_id: 'user_123',
        consent_type: 'marketing' as const,
        granted: true,
        timestamp: new Date().toISOString(),
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        legal_basis: 'CCPA Consent',
        version: '1.0'
      }

      const validation = legalComplianceManager.validateConsent(validConsent, ['CCPA'])
      expect(validation.valid).toBe(true)
    })
  })

  describe('Cookie Management', () => {
    it('debe inicializar preferencias de cookies correctamente', () => {
      const preferences = cookieManager.getPreferences()
      expect(preferences).toBeNull() // Inicialmente null
    })

    it('debe establecer preferencias de cookies', () => {
      cookieManager.setPreferences({
        analytics: true,
        marketing: false,
        functional: true
      })

      const preferences = cookieManager.getPreferences()
      expect(preferences).toBeDefined()
      expect(preferences?.analytics).toBe(true)
      expect(preferences?.marketing).toBe(false)
      expect(preferences?.functional).toBe(true)
      expect(preferences?.essential).toBe(true) // Siempre true
    })

    it('debe obtener cookies por categoría', () => {
      const essentialCookies = cookieManager.getCookiesByCategory('essential')
      expect(essentialCookies.length).toBeGreaterThan(0)
      expect(essentialCookies.every(cookie => cookie.category === 'essential')).toBe(true)

      const analyticsCookies = cookieManager.getCookiesByCategory('analytics')
      expect(analyticsCookies.length).toBeGreaterThan(0)
      expect(analyticsCookies.every(cookie => cookie.category === 'analytics')).toBe(true)
    })

    it('debe verificar si una cookie está permitida', () => {
      cookieManager.setPreferences({
        analytics: true,
        marketing: false,
        functional: true
      })

      expect(cookieManager.isCookieAllowed('session_id')).toBe(true) // Esencial
      expect(cookieManager.isCookieAllowed('_ga')).toBe(true) // Analytics permitido
      expect(cookieManager.isCookieAllowed('_fbp')).toBe(false) // Marketing no permitido
      expect(cookieManager.isCookieAllowed('theme_preference')).toBe(true) // Funcional permitido
    })

    it('debe generar informe de cookies', () => {
      const report = cookieManager.generateCookieReport()
      expect(report).toBeDefined()
      expect(report.preferences).toBeDefined()
      expect(report.cookies).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(report.summary.total_cookies).toBeGreaterThan(0)
    })

    it('debe verificar si el consentimiento ha expirado', () => {
      // Crear preferencias con timestamp muy antiguo
      const oldPreferences = {
        essential: true,
        analytics: true,
        marketing: false,
        functional: true,
        timestamp: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(), // 400 días
        version: '1.0'
      }

      // Simular que localStorage devuelve las preferencias antiguas
      localStorageMock.getItem.mockReturnValue(JSON.stringify(oldPreferences))
      
      // Recargar las preferencias desde localStorage
      cookieManager['loadPreferences']()
      
      expect(cookieManager.isConsentExpired()).toBe(true)
    })
  })

  describe('GDPR Utils', () => {
    it('debe validar bases legales GDPR', () => {
      expect(gdprManager.validateLegalBasis('consent')).toBe(true)
      expect(gdprManager.validateLegalBasis('contract')).toBe(true)
      expect(gdprManager.validateLegalBasis('legitimate_interests')).toBe(true)
      expect(gdprManager.validateLegalBasis('invalid_basis')).toBe(false)
    })

    it('debe crear registro de consentimiento GDPR', () => {
      const consent = gdprManager.createConsentRecord(
        'user_123',
        'marketing',
        'consent',
        true,
        '192.168.1.1',
        'Mozilla/5.0'
      )

      expect(consent.data_subject_id).toBe('user_123')
      expect(consent.purpose).toBe('marketing')
      expect(consent.legal_basis).toBe('consent')
      expect(consent.granted).toBe(true)
    })

    it('debe procesar solicitud de acceso a datos', () => {
      const request = gdprManager.processAccessRequest('user_123')
      
      expect(request.data_subject_id).toBe('user_123')
      expect(request.request_type).toBe('access')
      expect(request.status).toBe('processing')
      expect(request.response_deadline).toBeDefined()
    })

    it('debe procesar solicitud de eliminación (derecho al olvido)', () => {
      const request = gdprManager.processErasureRequest('user_123', 'Solicitud del usuario')
      
      expect(request.data_subject_id).toBe('user_123')
      expect(request.request_type).toBe('erasure')
      expect(request.reason).toBe('Solicitud del usuario')
      expect(request.exceptions).toBeDefined()
    })

    it('debe procesar solicitud de portabilidad', () => {
      const request = gdprManager.processPortabilityRequest('user_123', 'json')
      
      expect(request.data_subject_id).toBe('user_123')
      expect(request.request_type).toBe('portability')
      expect(request.format).toBe('json')
      expect(request.data_categories).toBeDefined()
    })

    it('debe registrar brecha de datos', () => {
      const breach = gdprManager.registerDataBreach({
        description: 'Acceso no autorizado a base de datos',
        data_categories: ['datos_identificativos', 'datos_contacto'],
        data_subjects_affected: 100,
        discovered_at: new Date().toISOString(),
        risk_level: 'high',
        measures_taken: ['Notificación inmediata', 'Cierre de acceso']
      })

      expect(breach.id).toBeDefined()
      expect(breach.description).toBe('Acceso no autorizado a base de datos')
      expect(breach.risk_level).toBe('high')
    })

    it('debe realizar DPIA para actividades de alto riesgo', () => {
      const dpia = gdprManager.performDPIA('dpa_001')
      
      expect(dpia.activity_id).toBe('dpa_001')
      expect(dpia.risk_assessment).toBeDefined()
      expect(dpia.measures).toBeDefined()
      expect(dpia.recommendations).toBeDefined()
      expect(dpia.approval.dpo_approved).toBe(true)
    })

    it('debe generar informe de conformidad GDPR', () => {
      const report = gdprManager.generateComplianceReport()
      
      expect(report.data_controller).toBe('Stack21 S.L.')
      expect(report.dpo_contact).toBe('privacy@stack21.com')
      expect(report.compliance_score).toBeGreaterThanOrEqual(0)
      expect(report.compliance_score).toBeLessThanOrEqual(100)
      expect(report.recommendations).toBeDefined()
    })

    it('debe verificar si se requiere DPIA', () => {
      const highRiskActivity = {
        id: 'dpa_high_risk',
        name: 'Procesamiento de datos sensibles',
        purpose: 'Análisis de datos de salud',
        legal_basis: 'consent',
        data_categories: ['datos_sensibles'],
        data_subjects: ['pacientes'],
        recipients: ['Stack21'],
        third_country_transfers: false,
        retention_period: '5 años',
        security_measures: ['encriptación'],
        dpo_assessment: true,
        dpia_required: false,
        dpia_completed: false,
        data_subjects_affected: 1500 // Más de 1000 sujetos = DPIA requerido
      }

      expect(gdprManager.requiresDPIA(highRiskActivity)).toBe(true)
    })
  })

  describe('Integración de Conformidad', () => {
    it('debe generar aviso de privacidad personalizado', () => {
      const gdprNotice = legalComplianceManager.generatePrivacyNotice(['GDPR'])
      expect(gdprNotice).toContain('GDPR')
      expect(gdprNotice).toContain('Derecho de acceso')
      expect(gdprNotice).toContain('Derecho al olvido')

      const ccpaNotice = legalComplianceManager.generatePrivacyNotice(['CCPA'])
      expect(ccpaNotice).toContain('CCPA')
      expect(ccpaNotice).toContain('Derecho a saber')
      expect(ccpaNotice).toContain('Derecho a eliminar')
    })

    it('debe generar informe de conformidad completo', () => {
      const report = legalComplianceManager.generateComplianceReport('user_123', ['GDPR', 'CCPA'])
      
      expect(report.user_id).toBe('user_123')
      expect(report.regulations).toContain('GDPR')
      expect(report.regulations).toContain('CCPA')
      expect(report.compliance_status).toBe('compliant')
      expect(report.recommendations).toBeDefined()
    })
  })

  describe('Casos Edge y Validaciones', () => {
    it('debe manejar regiones no reconocidas', () => {
      const unknownRegulations = legalComplianceManager.getApplicableRegulations('XX')
      expect(unknownRegulations).toHaveLength(0)
    })

    it('debe manejar consentimiento con base legal inválida', () => {
      expect(() => {
        gdprManager.createConsentRecord(
          'user_123',
          'marketing',
          'invalid_basis' as any,
          true,
          '192.168.1.1',
          'Mozilla/5.0'
        )
      }).toThrow('Base legal inválida según GDPR')
    })

    it('debe manejar solicitudes de datos inexistentes', () => {
      const request = gdprManager.processAccessRequest('user_nonexistent')
      expect(request.data_subject_id).toBe('user_nonexistent')
      expect(request.status).toBe('processing')
    })

    it('debe validar períodos de retención mínimos', () => {
      const minRetention = legalComplianceManager.getRetentionPeriod('technical_data', ['GDPR'])
      expect(minRetention).toBe(90) // 3 meses mínimo para datos técnicos
    })
  })
})
