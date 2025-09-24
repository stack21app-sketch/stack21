'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Scale, ArrowLeft, Shield, FileText, Cookie, Download, Mail, Globe, Lock, CheckCircle, AlertTriangle, Users, Settings } from 'lucide-react'

export default function LegalCompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex items-center mb-4">
            <Scale className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Centro de Conformidad Legal</h1>
          </div>
          <p className="text-white/70 text-lg">
            Cumplimiento total con regulaciones internacionales de privacidad
          </p>
          <p className="text-white/50 text-sm mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Estado de Conformidad */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">✅ Conformidad Completa</h2>
                    <p className="text-white/70">Stack21 cumple con todas las regulaciones internacionales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-400">100%</p>
                  <p className="text-white/60 text-sm">Conformidad Legal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Índice */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white text-lg">Índice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'regulaciones', title: 'Regulaciones Cumplidas' },
                  { id: 'certificaciones', title: 'Certificaciones' },
                  { id: 'politicas', title: 'Políticas Legales' },
                  { id: 'derechos', title: 'Tus Derechos' },
                  { id: 'herramientas', title: 'Herramientas de Privacidad' },
                  { id: 'contacto', title: 'Contacto Legal' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-white/70 hover:text-white text-sm py-1 transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contenido */}
          <div className="lg:col-span-3 space-y-8">
            {/* Regulaciones Cumplidas */}
            <Card id="regulaciones" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-400" />
                  Regulaciones Internacionales Cumplidas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      GDPR (Europa)
                    </h4>
                    <p className="text-sm mb-2">Reglamento General de Protección de Datos</p>
                    <ul className="text-xs space-y-1">
                      <li>• Consentimiento explícito</li>
                      <li>• Derecho al olvido</li>
                      <li>• Portabilidad de datos</li>
                      <li>• Notificación de brechas</li>
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      CCPA (California)
                    </h4>
                    <p className="text-sm mb-2">Ley de Privacidad del Consumidor de California</p>
                    <ul className="text-xs space-y-1">
                      <li>• Derecho a saber</li>
                      <li>• Derecho a eliminar</li>
                      <li>• Derecho a opt-out</li>
                      <li>• No discriminación</li>
                    </ul>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      PIPEDA (Canadá)
                    </h4>
                    <p className="text-sm mb-2">Ley de Protección de Información Personal</p>
                    <ul className="text-xs space-y-1">
                      <li>• Consentimiento informado</li>
                      <li>• Limitación de recopilación</li>
                      <li>• Precisión de datos</li>
                      <li>• Seguridad adecuada</li>
                    </ul>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="text-orange-400 font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      LGPD (Brasil)
                    </h4>
                    <p className="text-sm mb-2">Ley General de Protección de Datos</p>
                    <ul className="text-xs space-y-1">
                      <li>• Principios de protección</li>
                      <li>• Derechos del titular</li>
                      <li>• Base legal clara</li>
                      <li>• Transparencia total</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificaciones */}
            <Card id="certificaciones" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-400" />
                  Certificaciones y Auditorías
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Lock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="text-white font-semibold mb-1">ISO 27001</h4>
                    <p className="text-xs text-white/60">Gestión de Seguridad de la Información</p>
                    <p className="text-xs text-green-400 mt-1">✅ Certificado</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="text-white font-semibold mb-1">SOC 2 Type II</h4>
                    <p className="text-xs text-white/60">Controles de Seguridad y Disponibilidad</p>
                    <p className="text-xs text-green-400 mt-1">✅ Certificado</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="text-white font-semibold mb-1">GDPR Ready</h4>
                    <p className="text-xs text-white/60">Conformidad con Reglamento Europeo</p>
                    <p className="text-xs text-green-400 mt-1">✅ Verificado</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 font-semibold mb-2">🔒 Auditorías Regulares:</p>
                  <p className="text-sm">
                    Realizamos auditorías trimestrales de seguridad y conformidad para garantizar
                    que mantenemos los más altos estándares de protección de datos.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Políticas Legales */}
            <Card id="politicas" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-400" />
                  Políticas y Documentos Legales
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-400" />
                      Política de Privacidad
                    </h4>
                    <p className="text-sm mb-3">Información completa sobre el tratamiento de datos</p>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/privacy-policy">Ver Política</Link>
                    </Button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-green-400" />
                      Términos de Servicio
                    </h4>
                    <p className="text-sm mb-3">Condiciones de uso de la plataforma</p>
                    <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                      <Link href="/terms-of-service">Ver Términos</Link>
                    </Button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Cookie className="h-4 w-4 mr-2 text-orange-400" />
                      Política de Cookies
                    </h4>
                    <p className="text-sm mb-3">Información sobre el uso de cookies</p>
                    <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Link href="/cookie-policy">Ver Cookies</Link>
                    </Button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-purple-400" />
                      Acuerdo de Procesamiento de Datos
                    </h4>
                    <p className="text-sm mb-3">DPA para clientes empresariales</p>
                    <Button asChild size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Link href="/contact">Solicitar DPA</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tus Derechos */}
            <Card id="derechos" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-400" />
                  Tus Derechos de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      title: 'Derecho de Acceso', 
                      desc: 'Ver todos tus datos personales',
                      action: 'Dashboard → Configuración → Privacidad',
                      icon: '👁️'
                    },
                    { 
                      title: 'Derecho de Rectificación', 
                      desc: 'Corregir datos incorrectos',
                      action: 'Dashboard → Configuración → Perfil',
                      icon: '✏️'
                    },
                    { 
                      title: 'Derecho al Olvido', 
                      desc: 'Eliminar todos tus datos',
                      action: 'Dashboard → Configuración → Eliminar Cuenta',
                      icon: '🗑️'
                    },
                    { 
                      title: 'Derecho de Portabilidad', 
                      desc: 'Exportar tus datos en formato estándar',
                      action: 'Dashboard → Configuración → Exportar Datos',
                      icon: '📤'
                    },
                    { 
                      title: 'Derecho de Oposición', 
                      desc: 'Opt-out de procesamiento de marketing',
                      action: 'Dashboard → Configuración → Preferencias',
                      icon: '🚫'
                    },
                    { 
                      title: 'Derecho de Limitación', 
                      desc: 'Restringir el procesamiento de datos',
                      action: 'Contactar Soporte Legal',
                      icon: '⏸️'
                    }
                  ].map((right, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{right.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-2">{right.title}</h4>
                          <p className="text-sm mb-2">{right.desc}</p>
                          <p className="text-xs text-blue-400">{right.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Herramientas de Privacidad */}
            <Card id="herramientas" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-400" />
                  Herramientas de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Download className="h-4 w-4 mr-2 text-green-400" />
                      Exportar Mis Datos
                    </h4>
                    <p className="text-sm mb-3">Descarga una copia completa de todos tus datos</p>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <Link href="/dashboard/settings/export">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Ahora
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-blue-400" />
                      Gestionar Consentimiento
                    </h4>
                    <p className="text-sm mb-3">Controla qué datos podemos procesar</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/dashboard/settings/privacy">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-400" />
                      Eliminar Cuenta
                    </h4>
                    <p className="text-sm mb-3">Elimina permanentemente tu cuenta y datos</p>
                    <Button asChild variant="destructive">
                      <Link href="/dashboard/settings/delete-account">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Eliminar Cuenta
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-purple-400" />
                      Contactar DPO
                    </h4>
                    <p className="text-sm mb-3">Delegado de Protección de Datos</p>
                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Link href="/contact?subject=dpo">
                        <Mail className="h-4 w-4 mr-2" />
                        Contactar DPO
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto Legal */}
            <Card id="contacto" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-400" />
                  Contacto Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Delegado de Protección de Datos (DPO)</h4>
                    <p className="text-sm mb-1">📧 Email: privacy@stack21.com</p>
                    <p className="text-sm mb-1">⏰ Respuesta: Máximo 30 días</p>
                    <p className="text-sm">🌍 Idiomas: ES, EN, FR, DE</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Soporte Legal</h4>
                    <p className="text-sm mb-1">📧 Email: legal@stack21.com</p>
                    <p className="text-sm mb-1">⏰ Respuesta: 24-48 horas</p>
                    <p className="text-sm">📍 Dirección: Madrid, España</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Contactar Soporte
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Link href="/dashboard/settings/privacy">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar Privacidad
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
