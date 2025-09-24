'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, ArrowLeft, Scale, AlertTriangle, Shield } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Términos de Servicio</h1>
          </div>
          <p className="text-white/70 text-lg">
            Condiciones de uso de la plataforma Stack21
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
                  { id: 'aceptacion', title: 'Aceptación de Términos' },
                  { id: 'servicio', title: 'Descripción del Servicio' },
                  { id: 'cuenta', title: 'Cuenta de Usuario' },
                  { id: 'uso', title: 'Uso Permitido' },
                  { id: 'facturacion', title: 'Facturación y Pagos' },
                  { id: 'propiedad', title: 'Propiedad Intelectual' },
                  { id: 'limitaciones', title: 'Limitaciones de Responsabilidad' },
                  { id: 'terminacion', title: 'Terminación' },
                  { id: 'modificaciones', title: 'Modificaciones' },
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
            {/* Aceptación de Términos */}
            <Card id="aceptacion" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-blue-400" />
                  Aceptación de Términos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <p>
                  Al acceder y utilizar Stack21 ("el Servicio"), usted acepta estar sujeto a estos
                  Términos de Servicio ("Términos"). Si no está de acuerdo con alguna parte de estos
                  términos, no puede utilizar nuestro servicio.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 font-semibold mb-2">Importante:</p>
                  <p className="text-sm">
                    Estos términos constituyen un acuerdo legal vinculante entre usted y Stack21.
                    Léalos cuidadosamente antes de usar nuestros servicios.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card id="contacto" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <p>
                  Si tiene preguntas sobre estos Términos de Servicio, contáctenos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">📧 Email: legal@stack21.com</p>
                    <p className="text-sm">🌐 Web: https://stack21.com/contact</p>
                  </div>
                  <div>
                    <p className="text-sm">📍 Dirección: Madrid, España</p>
                    <p className="text-sm">⏰ Horario: Lun-Vie 9:00-18:00 CET</p>
                  </div>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/contact">Contactar Soporte Legal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
