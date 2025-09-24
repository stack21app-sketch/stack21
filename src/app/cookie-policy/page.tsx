'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Cookie, ArrowLeft, Settings, Shield, Eye, BarChart3, Target, Users } from 'lucide-react'

export default function CookiePolicyPage() {
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
            <Cookie className="h-8 w-8 text-orange-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Política de Cookies</h1>
          </div>
          <p className="text-white/70 text-lg">
            Información sobre el uso de cookies en Stack21
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
                  { id: 'que-son', title: '¿Qué son las Cookies?' },
                  { id: 'tipos', title: 'Tipos de Cookies' },
                  { id: 'cookies-uso', title: 'Cookies que Usamos' },
                  { id: 'terceros', title: 'Cookies de Terceros' },
                  { id: 'gestion', title: 'Gestión de Cookies' },
                  { id: 'derechos', title: 'Tus Derechos' },
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
            {/* ¿Qué son las Cookies? */}
            <Card id="que-son" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Cookie className="h-5 w-5 mr-2 text-orange-400" />
                  ¿Qué son las Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando
                  visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia de navegación y a
                  proporcionar servicios personalizados.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 font-semibold mb-2">💡 Información Importante:</p>
                  <p className="text-sm">
                    Stack21 utiliza cookies de manera responsable y transparente, cumpliendo con
                    todas las regulaciones de privacidad internacionales.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Cookies */}
            <Card id="tipos" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-400" />
                  Tipos de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">🍪 Cookies Esenciales</h4>
                    <p className="text-sm mb-2">Necesarias para el funcionamiento básico del sitio</p>
                    <ul className="text-xs space-y-1">
                      <li>• Autenticación de usuarios</li>
                      <li>• Preferencias de sesión</li>
                      <li>• Seguridad y prevención de fraude</li>
                      <li>• Carrito de compras</li>
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">📊 Cookies Analíticas</h4>
                    <p className="text-sm mb-2">Nos ayudan a entender cómo usas nuestro sitio</p>
                    <ul className="text-xs space-y-1">
                      <li>• Google Analytics</li>
                      <li>• Métricas de rendimiento</li>
                      <li>• Comportamiento del usuario</li>
                      <li>• Optimización del sitio</li>
                    </ul>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="text-orange-400 font-semibold mb-2">🎯 Cookies de Marketing</h4>
                    <p className="text-sm mb-2">Para personalizar anuncios y contenido</p>
                    <ul className="text-xs space-y-1">
                      <li>• Publicidad dirigida</li>
                      <li>• Remarketing</li>
                      <li>• Redes sociales</li>
                      <li>• Personalización</li>
                    </ul>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">⚙️ Cookies Funcionales</h4>
                    <p className="text-sm mb-2">Mejoran la funcionalidad del sitio</p>
                    <ul className="text-xs space-y-1">
                      <li>• Preferencias de idioma</li>
                      <li>• Configuraciones de tema</li>
                      <li>• Recordar configuraciones</li>
                      <li>• Funciones personalizadas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies que Usamos */}
            <Card id="cookies-uso" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                  Cookies que Utilizamos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-white">Cookie</th>
                        <th className="text-left py-2 text-white">Propósito</th>
                        <th className="text-left py-2 text-white">Duración</th>
                        <th className="text-left py-2 text-white">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-blue-400 font-mono">session_id</td>
                        <td className="py-2">Identificación de sesión del usuario</td>
                        <td className="py-2">Sesión</td>
                        <td className="py-2"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Esencial</span></td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-blue-400 font-mono">auth_token</td>
                        <td className="py-2">Token de autenticación seguro</td>
                        <td className="py-2">30 días</td>
                        <td className="py-2"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Esencial</span></td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-blue-400 font-mono">_ga</td>
                        <td className="py-2">Google Analytics - Identificación única</td>
                        <td className="py-2">2 años</td>
                        <td className="py-2"><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Analítica</span></td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-blue-400 font-mono">_gid</td>
                        <td className="py-2">Google Analytics - Identificación de sesión</td>
                        <td className="py-2">24 horas</td>
                        <td className="py-2"><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Analítica</span></td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-blue-400 font-mono">cookie_consent</td>
                        <td className="py-2">Preferencias de consentimiento</td>
                        <td className="py-2">1 año</td>
                        <td className="py-2"><span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">Funcional</span></td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-blue-400 font-mono">theme_preference</td>
                        <td className="py-2">Preferencia de tema (claro/oscuro)</td>
                        <td className="py-2">1 año</td>
                        <td className="py-2"><span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">Funcional</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Cookies de Terceros */}
            <Card id="terceros" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Cookies de Terceros
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Google Analytics</h4>
                    <p className="text-sm mb-2">Análisis de tráfico y comportamiento</p>
                    <p className="text-xs text-white/60">Política: <a href="https://policies.google.com/privacy" className="text-blue-400 hover:underline">Google Privacy Policy</a></p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Stripe</h4>
                    <p className="text-sm mb-2">Procesamiento de pagos seguro</p>
                    <p className="text-xs text-white/60">Política: <a href="https://stripe.com/privacy" className="text-blue-400 hover:underline">Stripe Privacy Policy</a></p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Vercel</h4>
                    <p className="text-sm mb-2">Hosting y análisis de rendimiento</p>
                    <p className="text-xs text-white/60">Política: <a href="https://vercel.com/legal/privacy-policy" className="text-blue-400 hover:underline">Vercel Privacy Policy</a></p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Supabase</h4>
                    <p className="text-sm mb-2">Base de datos y autenticación</p>
                    <p className="text-xs text-white/60">Política: <a href="https://supabase.com/privacy" className="text-blue-400 hover:underline">Supabase Privacy Policy</a></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Cookies */}
            <Card id="gestion" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-400" />
                  Gestión de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <p>
                  Puedes gestionar tus preferencias de cookies de varias maneras:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">🎛️ Panel de Control</h4>
                    <p className="text-sm mb-3">Gestiona tus preferencias desde tu cuenta</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/dashboard/settings/privacy">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar Cookies
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">🌐 Configuración del Navegador</h4>
                    <p className="text-sm mb-3">Bloquea o elimina cookies desde tu navegador</p>
                    <div className="space-y-2 text-xs">
                      <p><strong>Chrome:</strong> Configuración → Privacidad → Cookies</p>
                      <p><strong>Firefox:</strong> Opciones → Privacidad → Cookies</p>
                      <p><strong>Safari:</strong> Preferencias → Privacidad → Cookies</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-400 font-semibold mb-2">⚠️ Importante:</p>
                  <p className="text-sm">
                    Deshabilitar cookies esenciales puede afectar la funcionalidad del sitio.
                    Algunas características pueden no funcionar correctamente.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tus Derechos */}
            <Card id="derechos" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-400" />
                  Tus Derechos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Derecho a la Información', desc: 'Saber qué cookies usamos y por qué' },
                    { title: 'Derecho al Consentimiento', desc: 'Elegir qué cookies aceptar' },
                    { title: 'Derecho de Acceso', desc: 'Ver qué datos recopilamos' },
                    { title: 'Derecho de Rectificación', desc: 'Corregir datos incorrectos' },
                    { title: 'Derecho al Olvido', desc: 'Eliminar tus datos' },
                    { title: 'Derecho de Portabilidad', desc: 'Exportar tus datos' }
                  ].map((right, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">{right.title}</h4>
                      <p className="text-sm">{right.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card id="contacto" className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-400" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4">
                <p>
                  Si tienes preguntas sobre nuestra política de cookies, contáctanos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">📧 Email: privacy@stack21.com</p>
                    <p className="text-sm">🌐 Web: https://stack21.com/contact</p>
                  </div>
                  <div>
                    <p className="text-sm">📍 Dirección: Madrid, España</p>
                    <p className="text-sm">⏰ Horario: Lun-Vie 9:00-18:00 CET</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/contact">Contactar Soporte</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Link href="/legal-compliance">Centro de Conformidad</Link>
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
