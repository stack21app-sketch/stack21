/**
 * Utilidades de Conformidad Legal
 * 
 * Este archivo contiene funciones para gestionar la conformidad con
 * regulaciones internacionales de privacidad como GDPR, CCPA, PIPEDA, LGPD, etc.
 */

export interface LegalComplianceConfig {
  gdpr: {
    enabled: boolean
    dpo_email: string
    data_controller: string
    data_processor: string
    retention_periods: {
      profile_data: number // días
      usage_data: number
      technical_data: number
      billing_data: number
    }
  }
  ccpa: {
    enabled: boolean
    business_name: string
    dpo_email: string
    opt_out_url: string
  }
  pipeda: {
    enabled: boolean
    privacy_officer: string
    organization_name: string
  }
  lgpd: {
    enabled: boolean
    dpo_email: string
    data_controller: string
    anpd_notification: boolean
  }
}

export interface ConsentRecord {
  id: string
  user_id: string
  consent_type: 'essential' | 'analytics' | 'marketing' | 'functional'
  granted: boolean
  timestamp: string
  ip_address: string
  user_agent: string
  legal_basis: string
  version: string
}

export interface DataSubjectRequest {
  id: string
  user_id: string
  request_type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  requested_at: string
  processed_at?: string
  response_data?: any
  legal_basis?: string
}

export class LegalComplianceManager {
  private config: LegalComplianceConfig

  constructor(config: LegalComplianceConfig) {
    this.config = config
  }

  /**
   * Verifica si una región está cubierta por GDPR
   */
  isGDPRRegion(countryCode: string): boolean {
    const gdprCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO'
    ]
    return gdprCountries.includes(countryCode.toUpperCase())
  }

  /**
   * Verifica si una región está cubierta por CCPA
   */
  isCCPARegion(countryCode: string, stateCode?: string): boolean {
    return countryCode.toUpperCase() === 'US' && stateCode?.toUpperCase() === 'CA'
  }

  /**
   * Verifica si una región está cubierta por PIPEDA
   */
  isPIPEDARegion(countryCode: string): boolean {
    return countryCode.toUpperCase() === 'CA'
  }

  /**
   * Verifica si una región está cubierta por LGPD
   */
  isLGPDRegion(countryCode: string): boolean {
    return countryCode.toUpperCase() === 'BR'
  }

  /**
   * Determina qué regulaciones aplican para un usuario
   */
  getApplicableRegulations(countryCode: string, stateCode?: string): string[] {
    const regulations: string[] = []

    if (this.isGDPRRegion(countryCode)) {
      regulations.push('GDPR')
    }

    if (this.isCCPARegion(countryCode, stateCode)) {
      regulations.push('CCPA')
    }

    if (this.isPIPEDARegion(countryCode)) {
      regulations.push('PIPEDA')
    }

    if (this.isLGPDRegion(countryCode)) {
      regulations.push('LGPD')
    }

    return regulations
  }

  /**
   * Valida el consentimiento según las regulaciones aplicables
   */
  validateConsent(consent: ConsentRecord, regulations: string[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validaciones GDPR
    if (regulations.includes('GDPR')) {
      if (!consent.timestamp) {
        errors.push('GDPR requiere timestamp de consentimiento')
      }

      if (!consent.legal_basis) {
        errors.push('GDPR requiere base legal para el consentimiento')
      }

      if (consent.consent_type === 'essential' && !consent.granted) {
        errors.push('GDPR: cookies esenciales no pueden ser rechazadas')
      }
    }

    // Validaciones CCPA
    if (regulations.includes('CCPA')) {
      if (consent.consent_type === 'marketing' && consent.granted) {
        // CCPA requiere opt-out fácil para marketing
        if (!consent.timestamp) {
          errors.push('CCPA requiere timestamp para consentimiento de marketing')
        }
      }
    }

    // Validaciones PIPEDA
    if (regulations.includes('PIPEDA')) {
      if (!consent.timestamp) {
        errors.push('PIPEDA requiere timestamp de consentimiento')
      }
    }

    // Validaciones LGPD
    if (regulations.includes('LGPD')) {
      if (!consent.legal_basis) {
        errors.push('LGPD requiere base legal para el consentimiento')
      }

      if (consent.consent_type === 'essential' && !consent.granted) {
        errors.push('LGPD: cookies esenciales no pueden ser rechazadas')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Genera un registro de consentimiento válido
   */
  createConsentRecord(
    user_id: string,
    consent_type: ConsentRecord['consent_type'],
    granted: boolean,
    ip_address: string,
    user_agent: string,
    regulations: string[]
  ): ConsentRecord {
    const timestamp = new Date().toISOString()
    
    // Determinar base legal según el tipo de consentimiento
    let legal_basis = ''
    if (consent_type === 'essential') {
      legal_basis = 'Art. 6.1.b GDPR - Contrato'
    } else if (consent_type === 'analytics') {
      legal_basis = 'Art. 6.1.a GDPR - Consentimiento'
    } else if (consent_type === 'marketing') {
      legal_basis = 'Art. 6.1.a GDPR - Consentimiento'
    } else if (consent_type === 'functional') {
      legal_basis = 'Art. 6.1.f GDPR - Interés Legítimo'
    }

    const consent: ConsentRecord = {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id,
      consent_type,
      granted,
      timestamp,
      ip_address,
      user_agent,
      legal_basis,
      version: '1.0'
    }

    // Validar el consentimiento
    const validation = this.validateConsent(consent, regulations)
    if (!validation.valid) {
      throw new Error(`Consentimiento inválido: ${validation.errors.join(', ')}`)
    }

    return consent
  }

  /**
   * Procesa una solicitud de derechos del titular de datos
   */
  async processDataSubjectRequest(
    user_id: string,
    request_type: DataSubjectRequest['request_type'],
    regulations: string[]
  ): Promise<DataSubjectRequest> {
    const request: DataSubjectRequest = {
      id: `dsr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id,
      request_type,
      status: 'pending',
      requested_at: new Date().toISOString()
    }

    // Validar según regulaciones aplicables
    if (regulations.includes('GDPR')) {
      // GDPR requiere respuesta en 30 días
      request.legal_basis = 'Art. 15-22 GDPR'
    }

    if (regulations.includes('CCPA')) {
      // CCPA requiere respuesta en 45 días
      request.legal_basis = 'CCPA Section 1798.100-1798.150'
    }

    if (regulations.includes('PIPEDA')) {
      // PIPEDA requiere respuesta en 30 días
      request.legal_basis = 'PIPEDA Section 8'
    }

    if (regulations.includes('LGPD')) {
      // LGPD requiere respuesta en 15 días
      request.legal_basis = 'LGPD Art. 18-22'
    }

    return request
  }

  /**
   * Calcula el período de retención según las regulaciones
   */
  getRetentionPeriod(dataType: string, regulations: string[]): number {
    // Períodos por defecto (en días)
    const defaultPeriods: Record<string, number> = {
      profile_data: 730, // 2 años
      usage_data: 365,   // 1 año
      technical_data: 90, // 3 meses
      billing_data: 2555 // 7 años (fiscal)
    }

    let retentionPeriod = defaultPeriods[dataType] || 365

    // Ajustar según regulaciones específicas
    if (regulations.includes('GDPR')) {
      // GDPR no especifica períodos, usar principio de minimización
      if (dataType === 'technical_data') {
        retentionPeriod = 90 // 3 meses máximo para datos técnicos
      }
    }

    if (regulations.includes('CCPA')) {
      // CCPA no especifica períodos, usar períodos razonables
      if (dataType === 'marketing_data') {
        retentionPeriod = 365 // 1 año para datos de marketing
      }
    }

    if (regulations.includes('LGPD')) {
      // LGPD requiere períodos específicos
      if (dataType === 'personal_data') {
        retentionPeriod = 365 // 1 año para datos personales
      }
    }

    return retentionPeriod
  }

  /**
   * Genera un informe de conformidad
   */
  generateComplianceReport(user_id: string, regulations: string[]): { user_id: string; generated_at: string; regulations: string[]; compliance_status: string; data_processing_activities: any[]; consent_records: any[]; data_retention: Record<string, any>; rights_exercised: any[]; recommendations: string[] } {
    const report: { user_id: string; generated_at: string; regulations: string[]; compliance_status: string; data_processing_activities: any[]; consent_records: any[]; data_retention: Record<string, any>; rights_exercised: any[]; recommendations: string[] } = {
      user_id,
      generated_at: new Date().toISOString(),
      regulations,
      compliance_status: 'compliant',
      data_processing_activities: [],
      consent_records: [],
      data_retention: {},
      rights_exercised: [],
      recommendations: []
    }

    // Agregar recomendaciones según regulaciones
    if (regulations.includes('GDPR')) {
      report.recommendations.push('Implementar Privacy by Design')
      report.recommendations.push('Realizar DPIA para procesamiento de alto riesgo')
    }

    if (regulations.includes('CCPA')) {
      report.recommendations.push('Implementar botón "Do Not Sell My Personal Information"')
      report.recommendations.push('Crear página de divulgación de datos')
    }

    if (regulations.includes('LGPD')) {
      report.recommendations.push('Notificar a la ANPD sobre brechas de datos')
      report.recommendations.push('Implementar medidas de seguridad específicas')
    }

    return report
  }

  /**
   * Verifica si los datos deben ser eliminados según las regulaciones
   */
  shouldDeleteData(
    dataType: string,
    createdAt: string,
    regulations: string[]
  ): boolean {
    const retentionPeriod = this.getRetentionPeriod(dataType, regulations)
    const dataAge = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    
    return dataAge > retentionPeriod
  }

  /**
   * Genera un aviso de privacidad personalizado
   */
  generatePrivacyNotice(regulations: string[]): string {
    let notice = 'Stack21 - Aviso de Privacidad\n\n'

    if (regulations.includes('GDPR')) {
      notice += 'CONFORMIDAD GDPR (Europa)\n'
      notice += '• Derecho de acceso a tus datos personales\n'
      notice += '• Derecho de rectificación de datos incorrectos\n'
      notice += '• Derecho al olvido (eliminación de datos)\n'
      notice += '• Derecho de portabilidad de datos\n'
      notice += '• Derecho de oposición al procesamiento\n'
      notice += '• Derecho de limitación del procesamiento\n\n'
    }

    if (regulations.includes('CCPA')) {
      notice += 'CONFORMIDAD CCPA (California)\n'
      notice += '• Derecho a saber qué datos recopilamos\n'
      notice += '• Derecho a eliminar tus datos\n'
      notice += '• Derecho a opt-out de la venta de datos\n'
      notice += '• Derecho a no discriminación\n\n'
    }

    if (regulations.includes('PIPEDA')) {
      notice += 'CONFORMIDAD PIPEDA (Canadá)\n'
      notice += '• Principio de responsabilidad\n'
      notice += '• Identificación de propósitos\n'
      notice += '• Limitación de recopilación\n'
      notice += '• Limitación de uso y divulgación\n\n'
    }

    if (regulations.includes('LGPD')) {
      notice += 'CONFORMIDAD LGPD (Brasil)\n'
      notice += '• Principios de protección de datos\n'
      notice += '• Derechos del titular de datos\n'
      notice += '• Base legal para el procesamiento\n'
      notice += '• Transparencia en el tratamiento\n\n'
    }

    notice += 'Para más información, contacta a nuestro DPO: privacy@stack21.com'

    return notice
  }
}

// Configuración por defecto
export const defaultLegalConfig: LegalComplianceConfig = {
  gdpr: {
    enabled: true,
    dpo_email: 'privacy@stack21.com',
    data_controller: 'Stack21 S.L.',
    data_processor: 'Stack21 S.L.',
    retention_periods: {
      profile_data: 730,
      usage_data: 365,
      technical_data: 90,
      billing_data: 2555
    }
  },
  ccpa: {
    enabled: true,
    business_name: 'Stack21 S.L.',
    dpo_email: 'privacy@stack21.com',
    opt_out_url: 'https://stack21.com/opt-out'
  },
  pipeda: {
    enabled: true,
    privacy_officer: 'privacy@stack21.com',
    organization_name: 'Stack21 S.L.'
  },
  lgpd: {
    enabled: true,
    dpo_email: 'privacy@stack21.com',
    data_controller: 'Stack21 S.L.',
    anpd_notification: true
  }
}

// Instancia global del gestor de conformidad
export const legalComplianceManager = new LegalComplianceManager(defaultLegalConfig)
