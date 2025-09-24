/**
 * Utilidades específicas para GDPR
 * 
 * Este archivo contiene funciones específicas para el cumplimiento
 * del Reglamento General de Protección de Datos (GDPR) de la UE.
 */

export interface GDPRDataSubject {
  id: string
  email: string
  name?: string
  country: string
  data_controller: string
  dpo_email: string
}

export interface GDPRConsent {
  id: string
  data_subject_id: string
  purpose: string
  legal_basis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'
  granted: boolean
  timestamp: string
  ip_address: string
  user_agent: string
  version: string
  withdrawal_timestamp?: string
}

export interface GDPRDataProcessingActivity {
  id: string
  name: string
  purpose: string
  legal_basis: string
  data_categories: string[]
  data_subjects: string[]
  recipients: string[]
  third_country_transfers: boolean
  retention_period: string
  security_measures: string[]
  dpo_assessment: boolean
  dpia_required: boolean
  dpia_completed: boolean
  // Número estimado de interesados afectados (para evaluar DPIA)
  data_subjects_affected?: number
}

export interface GDPRBreach {
  id: string
  description: string
  data_categories: string[]
  data_subjects_affected: number
  discovered_at: string
  reported_at?: string
  authority_notified: boolean
  data_subjects_notified: boolean
  risk_level: 'low' | 'medium' | 'high'
  measures_taken: string[]
}

export class GDPRManager {
  private static instance: GDPRManager
  private dataProcessingActivities: GDPRDataProcessingActivity[] = []
  private breaches: GDPRBreach[] = []

  private constructor() {
    this.initializeDataProcessingActivities()
  }

  public static getInstance(): GDPRManager {
    if (!GDPRManager.instance) {
      GDPRManager.instance = new GDPRManager()
    }
    return GDPRManager.instance
  }

  /**
   * Inicializa las actividades de procesamiento de datos
   */
  private initializeDataProcessingActivities(): void {
    this.dataProcessingActivities = [
      {
        id: 'dpa_001',
        name: 'Gestión de cuentas de usuario',
        purpose: 'Crear y gestionar cuentas de usuarios de la plataforma',
        legal_basis: 'Art. 6.1.b - Contrato',
        data_categories: ['datos_identificativos', 'datos_contacto'],
        data_subjects: ['usuarios_registrados'],
        recipients: ['Stack21', 'proveedores_cloud'],
        third_country_transfers: true,
        retention_period: '2 años después de la cancelación',
        security_measures: ['encriptación', 'acceso_restringido', 'auditorías_regulares'],
        dpo_assessment: true,
        dpia_required: false,
        dpia_completed: false
      },
      {
        id: 'dpa_002',
        name: 'Análisis de uso y comportamiento',
        purpose: 'Analizar el uso de la plataforma para mejoras',
        legal_basis: 'Art. 6.1.f - Interés Legítimo',
        data_categories: ['datos_uso', 'datos_técnicos'],
        data_subjects: ['usuarios_registrados'],
        recipients: ['Stack21', 'Google_Analytics'],
        third_country_transfers: true,
        retention_period: '1 año',
        security_measures: ['anonimización', 'pseudonimización'],
        dpo_assessment: true,
        dpia_required: false,
        dpia_completed: false
      },
      {
        id: 'dpa_003',
        name: 'Marketing y comunicaciones',
        purpose: 'Enviar comunicaciones comerciales y marketing',
        legal_basis: 'Art. 6.1.a - Consentimiento',
        data_categories: ['datos_contacto', 'preferencias_marketing'],
        data_subjects: ['usuarios_consentidos'],
        recipients: ['Stack21', 'proveedores_email'],
        third_country_transfers: false,
        retention_period: 'Hasta retirada del consentimiento',
        security_measures: ['consentimiento_explícito', 'opt_out_fácil'],
        dpo_assessment: true,
        dpia_required: false,
        dpia_completed: false
      }
    ]
  }

  /**
   * Valida si una base legal es válida según GDPR
   */
  public validateLegalBasis(legalBasis: string): boolean {
    const validBases = [
      'consent',
      'contract',
      'legal_obligation',
      'vital_interests',
      'public_task',
      'legitimate_interests'
    ]
    return validBases.includes(legalBasis)
  }

  /**
   * Crea un registro de consentimiento GDPR
   */
  public createConsentRecord(
    dataSubjectId: string,
    purpose: string,
    legalBasis: GDPRConsent['legal_basis'],
    granted: boolean,
    ipAddress: string,
    userAgent: string
  ): GDPRConsent {
    if (!this.validateLegalBasis(legalBasis)) {
      throw new Error('Base legal inválida según GDPR')
    }

    const consent: GDPRConsent = {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data_subject_id: dataSubjectId,
      purpose,
      legal_basis: legalBasis,
      granted,
      timestamp: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
      version: '1.0'
    }

    return consent
  }

  /**
   * Retira el consentimiento GDPR
   */
  public withdrawConsent(consentId: string): boolean {
    // En producción, esto actualizaría la base de datos
    console.log(`Consentimiento ${consentId} retirado`)
    return true
  }

  /**
   * Procesa una solicitud de acceso a datos (Art. 15 GDPR)
   */
  public processAccessRequest(dataSubjectId: string): any {
    const request = {
      id: `access_${Date.now()}`,
      data_subject_id: dataSubjectId,
      request_type: 'access',
      status: 'processing',
      requested_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      data_categories: [
        'datos_identificativos',
        'datos_contacto',
        'datos_uso',
        'datos_técnicos',
        'datos_facturación'
      ],
      rights: [
        'Derecho de acceso a datos personales',
        'Derecho a información sobre el procesamiento',
        'Derecho a copia de los datos'
      ]
    }

    return request
  }

  /**
   * Procesa una solicitud de rectificación (Art. 16 GDPR)
   */
  public processRectificationRequest(dataSubjectId: string, corrections: any): any {
    const request = {
      id: `rectification_${Date.now()}`,
      data_subject_id: dataSubjectId,
      request_type: 'rectification',
      status: 'processing',
      requested_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      corrections,
      rights: [
        'Derecho de rectificación de datos inexactos',
        'Derecho de completar datos incompletos'
      ]
    }

    return request
  }

  /**
   * Procesa una solicitud de eliminación (Art. 17 GDPR - Derecho al Olvido)
   */
  public processErasureRequest(dataSubjectId: string, reason: string): any {
    const request = {
      id: `erasure_${Date.now()}`,
      data_subject_id: dataSubjectId,
      request_type: 'erasure',
      status: 'processing',
      requested_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      reason,
      rights: [
        'Derecho al olvido',
        'Derecho de eliminación de datos personales',
        'Derecho de notificación a terceros'
      ],
      exceptions: [
        'Datos necesarios para cumplir obligaciones legales',
        'Datos necesarios para el ejercicio de derechos',
        'Datos necesarios para intereses públicos',
        'Datos necesarios para investigación científica'
      ]
    }

    return request
  }

  /**
   * Procesa una solicitud de portabilidad (Art. 20 GDPR)
   */
  public processPortabilityRequest(dataSubjectId: string, format: string = 'json'): any {
    const request = {
      id: `portability_${Date.now()}`,
      data_subject_id: dataSubjectId,
      request_type: 'portability',
      status: 'processing',
      requested_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      format,
      rights: [
        'Derecho de portabilidad de datos',
        'Derecho a recibir datos en formato estructurado',
        'Derecho a transmitir datos a otro responsable'
      ],
      data_categories: [
        'datos_proporcionados_por_titular',
        'datos_obtenidos_por_consentimiento',
        'datos_obtenidos_por_contrato'
      ]
    }

    return request
  }

  /**
   * Procesa una solicitud de limitación (Art. 18 GDPR)
   */
  public processRestrictionRequest(dataSubjectId: string, reason: string): any {
    const request = {
      id: `restriction_${Date.now()}`,
      data_subject_id: dataSubjectId,
      request_type: 'restriction',
      status: 'processing',
      requested_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      reason,
      rights: [
        'Derecho de limitación del procesamiento',
        'Derecho a restringir el uso de datos',
        'Derecho a marcar datos para limitación'
      ],
      conditions: [
        'Exactitud de datos controvertida',
        'Procesamiento ilícito',
        'Responsable ya no necesita los datos',
        'Titular se opone al procesamiento'
      ]
    }

    return request
  }

  /**
   * Procesa una objeción (Art. 21 GDPR)
   */
  public processObjectionRequest(dataSubjectId: string, reason: string): any {
    const request = {
      id: `objection_${Date.now()}`,
      data_subject_id: dataSubjectId,
      request_type: 'objection',
      status: 'processing',
      requested_at: new Date().toISOString(),
      response_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      reason,
      rights: [
        'Derecho de oposición al procesamiento',
        'Derecho a oponerse a decisiones automatizadas',
        'Derecho a oponerse a marketing directo'
      ],
      exceptions: [
        'Intereses legítimos imperiosos',
        'Ejercicio o defensa de reclamaciones legales',
        'Protección de derechos de otros'
      ]
    }

    return request
  }

  /**
   * Registra una brecha de datos (Art. 33 GDPR)
   */
  public registerDataBreach(breach: Omit<GDPRBreach, 'id'>): GDPRBreach {
    const dataBreach: GDPRBreach = {
      id: `breach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...breach
    }

    this.breaches.push(dataBreach)

    // Notificar a la autoridad si es necesario (72 horas)
    if (dataBreach.risk_level === 'high' || dataBreach.risk_level === 'medium') {
      this.notifySupervisoryAuthority(dataBreach)
    }

    // Notificar a los titulares si es necesario
    if (dataBreach.risk_level === 'high') {
      this.notifyDataSubjects(dataBreach)
    }

    return dataBreach
  }

  /**
   * Notifica a la autoridad de control
   */
  private notifySupervisoryAuthority(breach: GDPRBreach): void {
    console.log(`Notificando brecha ${breach.id} a la autoridad de control`)
    // En producción, esto enviaría una notificación real
  }

  /**
   * Notifica a los titulares de datos
   */
  private notifyDataSubjects(breach: GDPRBreach): void {
    console.log(`Notificando brecha ${breach.id} a ${breach.data_subjects_affected} titulares`)
    // En producción, esto enviaría notificaciones reales
  }

  /**
   * Realiza una Evaluación de Impacto en la Protección de Datos (DPIA)
   */
  public performDPIA(activityId: string): any {
    const activity = this.dataProcessingActivities.find(a => a.id === activityId)
    if (!activity) {
      throw new Error('Actividad de procesamiento no encontrada')
    }

    const dpia = {
      id: `dpia_${Date.now()}`,
      activity_id: activityId,
      performed_at: new Date().toISOString(),
      performed_by: 'DPO',
      risk_assessment: {
        likelihood: 'medium',
        severity: 'medium',
        overall_risk: 'medium'
      },
      measures: [
        'Pseudonimización de datos',
        'Encriptación de extremo a extremo',
        'Acceso restringido basado en roles',
        'Auditorías regulares de seguridad',
        'Formación del personal'
      ],
      recommendations: [
        'Implementar medidas adicionales de seguridad',
        'Revisar anualmente la evaluación',
        'Notificar cambios significativos al DPO'
      ],
      approval: {
        dpo_approved: true,
        approval_date: new Date().toISOString()
      }
    }

    // Actualizar la actividad
    activity.dpia_completed = true

    return dpia
  }

  /**
   * Genera un informe de conformidad GDPR
   */
  public generateComplianceReport(): any {
    const report = {
      generated_at: new Date().toISOString(),
      data_controller: 'Stack21 S.L.',
      dpo_contact: 'privacy@stack21.com',
      supervisory_authority: 'AEPD (España)',
      data_processing_activities: this.dataProcessingActivities.length,
      active_breaches: this.breaches.filter(b => !b.authority_notified).length,
      dpia_completed: this.dataProcessingActivities.filter(a => a.dpia_completed).length,
      compliance_score: this.calculateComplianceScore(),
      recommendations: this.generateRecommendations()
    }

    return report
  }

  /**
   * Calcula el puntaje de conformidad
   */
  private calculateComplianceScore(): number {
    let score = 0
    let maxScore = 0

    // Puntaje por actividades de procesamiento
    maxScore += this.dataProcessingActivities.length * 10
    score += this.dataProcessingActivities.filter(a => a.dpo_assessment).length * 10

    // Puntaje por DPIA
    maxScore += this.dataProcessingActivities.length * 5
    score += this.dataProcessingActivities.filter(a => a.dpia_completed).length * 5

    // Puntaje por brechas (menos es mejor)
    maxScore += 10
    score += this.breaches.length === 0 ? 10 : Math.max(0, 10 - this.breaches.length)

    return Math.round((score / maxScore) * 100)
  }

  /**
   * Genera recomendaciones de conformidad
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.dataProcessingActivities.some(a => !a.dpo_assessment)) {
      recommendations.push('Realizar evaluación DPO para todas las actividades de procesamiento')
    }

    if (this.dataProcessingActivities.some(a => a.dpia_required && !a.dpia_completed)) {
      recommendations.push('Completar DPIA para actividades de alto riesgo')
    }

    if (this.breaches.length > 0) {
      recommendations.push('Revisar medidas de seguridad para prevenir futuras brechas')
    }

    if (this.dataProcessingActivities.some(a => a.third_country_transfers)) {
      recommendations.push('Revisar transferencias a terceros países y garantías adecuadas')
    }

    return recommendations
  }

  /**
   * Verifica si se requiere DPIA para una actividad
   */
  public requiresDPIA(activity: GDPRDataProcessingActivity): boolean {
    // Criterios para DPIA según GDPR Art. 35
    const highRiskCriteria = [
      'evaluación_sistemática_personas',
      'procesamiento_datos_sensibles',
      'vigilancia_sistemática',
      'datos_menores',
      'datos_penales'
    ]

    return activity.dpia_required || 
           activity.data_categories.some(cat => highRiskCriteria.includes(cat)) ||
           ((activity.data_subjects_affected ?? 0) > 1000)
  }
}

// Instancia global del gestor GDPR
export const gdprManager = GDPRManager.getInstance()
