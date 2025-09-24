'use client'

import { motion } from 'framer-motion'
import { AnimatedCard } from '@/components/ui/animated-card'
import { 
  Building2, 
  Users, 
  CreditCard, 
  Brain, 
  Workflow, 
  Zap,
  Lock,
  Globe,
  Database,
  Code
} from 'lucide-react'

const features = [
  {
    icon: Building2,
    title: 'Automatización Multi-tenant',
    description: 'Gestiona múltiples organizaciones con IA',
    content: 'Cada workspace tiene su propia IA personalizada, datos seguros y configuraciones independientes.',
    badge: 'Core'
  },
  {
    icon: Users,
    title: 'Autenticación',
    description: 'Google y GitHub OAuth integrados',
    content: 'Autenticación segura con NextAuth.js y soporte para múltiples proveedores OAuth.',
    badge: 'Seguro'
  },
  {
    icon: CreditCard,
    title: 'Facturación',
    description: 'Integración completa con Stripe',
    content: 'Sistema de facturación robusto con suscripciones, pagos y gestión de clientes.',
    badge: 'Stripe'
  },
  {
    icon: Brain,
    title: 'IA Inteligente',
    description: 'Automatización con GPT-4 y DALL-E',
    content: 'Genera código, imágenes, documentación y automatiza procesos con la IA más avanzada.',
    badge: 'IA'
  },
  {
    icon: Workflow,
    title: 'Workflows',
    description: 'Automatización de procesos de negocio',
    content: 'Crea y ejecuta workflows complejos con módulos personalizables y triggers automáticos.',
    badge: 'Auto'
  },
  {
    icon: Zap,
    title: 'Escalable',
    description: 'Construido con las mejores tecnologías',
    content: 'Next.js 14, Prisma, PostgreSQL y TypeScript para máxima escalabilidad y rendimiento.',
    badge: 'Fast'
  }
]

const additionalFeatures = [
  {
    icon: Lock,
    title: 'Seguridad Enterprise',
    content: 'Encriptación de extremo a extremo y cumplimiento GDPR'
  },
  {
    icon: Globe,
    title: 'Multi-región',
    content: 'Despliegue global con CDN y bases de datos distribuidas'
  },
  {
    icon: Database,
    title: 'Base de Datos',
    content: 'PostgreSQL con Prisma ORM para consultas optimizadas'
  },
  {
    icon: Code,
    title: 'API REST',
    content: 'API completa con documentación automática y rate limiting'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Automatiza tu negocio con
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {' '}Stack21
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La plataforma completa para automatizar procesos, generar contenido con IA y escalar tu negocio sin límites.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <AnimatedCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              content={feature.content}
              badge={feature.badge}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Características Adicionales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
