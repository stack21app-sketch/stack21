'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, ArrowLeft, Download, Mail, Globe, Lock, Eye, Trash2 } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
            <Shield className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Política de Privacidad</h1>
          </div>
          <p className="text-white/70 text-lg">
            Stack21 - Conformidad GDPR, CCPA y regulaciones internacionales
          </p>
          <p className="text-white/50 text-sm mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
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
                  { id: 'resumen', title: 'Resumen Ejecutivo' },
                  { id: 'datos', title: 'Datos que Recopilamos' },
                  { id: 'uso', title: 'Cómo Usamos los Datos' },
                  { id: 'base-legal', title: 'Base Legal (GDPR)' },
                  { id: 'derechos', title: 'Tus Derechos' },
                  { id: 'ccpa', title: 'Derechos CCPA' },
                  { id: 'cookies', title: 'Cookies y Tracking' },
                  { id: 'seguridad', title: 'Seguridad' },
                  { id: 'transferencias', title: 'Transferencias' },
                  { id: 'contacto', title: 'Contacto' }
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
            {/* Resumen Ejecutivo */}
            <Card id="resumen" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-400" />
                  Resumen Ejecutivo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <p>
                  Stack21 es una plataforma SaaS que respeta tu privacidad y cumple con las regulaciones
                  internacionales más estrictas incluyendo GDPR (Europa) y CCPA (California).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">✅ GDPR Compliant</h4>
                    <p className="text-sm">Cumplimiento total con el Reglamento General de Protección de Datos</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">✅ CCPA Compliant</h4>
                    <p className="text-sm">Cumplimiento con la Ley de Privacidad del Consumidor de California</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">✅ Internacional</h4>
                    <p className="text-sm">Conformidad con PIPEDA, LGPD y otras regulaciones globales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card id="contacto" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-400" />
                  Contacto y Soporte
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Delegado de Protección de Datos (DPO)</h4>
                    <p className="text-sm mb-1">Email: privacy@stack21.com</p>
                    <p className="text-sm mb-1">Respuesta: Máximo 30 días</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Soporte General</h4>
                    <p className="text-sm mb-1">Email: support@stack21.com</p>
                    <p className="text-sm mb-1">Respuesta: 24-48 horas</p>
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
                    <Link href="/dashboard/settings">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Mis Datos
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
