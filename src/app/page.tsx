'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/auth/signin')
  }

  const handleLiveDemo = () => {
    router.push('/dashboard')
  }

  const handleContactSales = () => {
    router.push('/contact')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2d1b69 50%, #11998e 75%, #38ef7d 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Tech Grid Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        zIndex: 1
      }} />
      
      {/* Floating Code Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '200px',
        height: '120px',
        background: 'rgba(0, 255, 255, 0.05)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        borderRadius: '8px',
        padding: '1rem',
        fontFamily: 'Monaco, Consolas, monospace',
        fontSize: '0.75rem',
        color: '#00ffff',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 2
      }}>
        <div style={{ color: '#ff6b6b' }}>const</div>
        <div style={{ color: '#4ecdc4' }}>workflow</div>
        <div style={{ color: '#45b7d1' }}>=</div>
        <div style={{ color: '#96ceb4' }}>await</div>
        <div style={{ color: '#feca57' }}>ai.create()</div>
      </div>
      
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '8%',
        width: '180px',
        height: '100px',
        background: 'rgba(255, 107, 107, 0.05)',
        border: '1px solid rgba(255, 107, 107, 0.2)',
        borderRadius: '8px',
        padding: '1rem',
        fontFamily: 'Monaco, Consolas, monospace',
        fontSize: '0.75rem',
        color: '#ff6b6b',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 2
      }}>
        <div style={{ color: '#4ecdc4' }}>API</div>
        <div style={{ color: '#45b7d1' }}>.call()</div>
        <div style={{ color: '#96ceb4' }}>.then()</div>
        <div style={{ color: '#feca57' }}>.catch()</div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '30%',
        left: '15%',
        width: '160px',
        height: '80px',
        background: 'rgba(78, 205, 196, 0.05)',
        border: '1px solid rgba(78, 205, 196, 0.2)',
        borderRadius: '8px',
        padding: '1rem',
        fontFamily: 'Monaco, Consolas, monospace',
        fontSize: '0.75rem',
        color: '#4ecdc4',
        animation: 'float 12s ease-in-out infinite',
        zIndex: 2
      }}>
        <div style={{ color: '#ff6b6b' }}>if</div>
        <div style={{ color: '#45b7d1' }}>(success)</div>
        <div style={{ color: '#96ceb4' }}>return</div>
        <div style={{ color: '#feca57' }}>data</div>
      </div>
      
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(78, 205, 196, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite',
        zIndex: 1
      }} />

      {/* Header */}
      <header style={{
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #00ffff 0%, #ff6b6b 50%, #4ecdc4 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)',
                animation: 'glow 2s ease-in-out infinite alternate',
                position: 'relative'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>⚡</span>
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  background: '#00ff00',
                  borderRadius: '50%',
                  animation: 'pulse 1s ease-in-out infinite'
                }} />
              </div>
              <div>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #00ffff 0%, #ff6b6b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Stack21</span>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#00ffff',
                  fontFamily: 'Monaco, Consolas, monospace',
                  marginTop: '-0.25rem'
                }}>v2.1.0</div>
              </div>
            </div>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <a href="/docs" style={{ 
                color: '#00ffff', 
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '0.875rem'
              }}>📚 docs</a>
              <a href="/pricing" style={{ 
                color: '#ff6b6b', 
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '0.875rem'
              }}>💰 pricing</a>
              <a href="/api" style={{ 
                color: '#4ecdc4', 
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '0.875rem'
              }}>🔌 api</a>
              <button 
                onClick={handleGetStarted}
                style={{
                  background: 'linear-gradient(135deg, #00ffff 0%, #ff6b6b 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1rem 2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  fontFamily: 'Monaco, Consolas, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                <span style={{ position: 'relative', zIndex: 2 }}>🚀 start()</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 2rem 6rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Live Status Indicator */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(0, 255, 0, 0.1)',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              color: '#00ff00',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '2rem',
              fontFamily: 'Monaco, Consolas, monospace'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#00ff00',
                borderRadius: '50%',
                animation: 'pulse 1s ease-in-out infinite'
              }} />
              <span>SYSTEM ONLINE</span>
              <span style={{ color: '#4ecdc4' }}>•</span>
              <span>99.9% UPTIME</span>
            </div>
            
            <h1 style={{
              fontSize: '5rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '2rem',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #00ffff 0%, #ff6b6b 50%, #4ecdc4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                position: 'relative'
              }}>
                AUTOMATE
              </span>
              <br />
              <span style={{ color: '#ffffff', fontSize: '0.6em' }}>EVERYTHING</span>
            </h1>
            
            
            
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              color: '#00ffff',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '2rem',
              fontFamily: 'Monaco, Consolas, monospace'
            }}>
              &gt; AI-POWERED WORKFLOW ENGINE v2.1.0
            </div>
            
            <p style={{
              fontSize: '1.5rem',
              color: '#cbd5e1',
              marginBottom: '3rem',
              maxWidth: '56rem',
              margin: '0 auto 3rem auto',
              lineHeight: '1.7',
              fontWeight: '400'
            }}>
              Build, deploy, and scale intelligent workflows with our advanced automation platform.
              <br />
              <span style={{ 
                color: '#00ffff', 
                fontWeight: '600',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                {/* Zero-config deployment • Real-time monitoring • Enterprise security */}
              </span>
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '2rem', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}>
              <button 
                onClick={handleGetStarted}
                style={{
                  background: 'linear-gradient(135deg, #00ffff 0%, #ff6b6b 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1.5rem 3rem',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px rgba(0, 255, 255, 0.4)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  fontFamily: 'Monaco, Consolas, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                <span style={{ position: 'relative', zIndex: 2 }}>🚀 DEPLOY NOW</span>
              </button>
              <button 
                onClick={handleLiveDemo}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#00ffff',
                  border: '2px solid rgba(0, 255, 255, 0.5)',
                  borderRadius: '1rem',
                  padding: '1.5rem 3rem',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Monaco, Consolas, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                📊 LIVE DEMO
              </button>
            </div>

            {/* Live Metrics Dashboard */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              marginTop: '4rem',
              maxWidth: '800px',
              margin: '4rem auto 0 auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  color: '#00ffff',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  LIVE METRICS
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#00ff00',
                  fontSize: '0.875rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#00ff00',
                    borderRadius: '50%',
                    animation: 'pulse 1s ease-in-out infinite'
                  }} />
                  REAL-TIME
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#00ffff',
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>10,247</div>
                  <div style={{ color: '#4ecdc4', fontSize: '0.875rem', fontFamily: 'Monaco, Consolas, monospace' }}>ACTIVE USERS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#ff6b6b',
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>99.97%</div>
                  <div style={{ color: '#4ecdc4', fontSize: '0.875rem', fontFamily: 'Monaco, Consolas, monospace' }}>UPTIME</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#4ecdc4',
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>2.1M</div>
                  <div style={{ color: '#4ecdc4', fontSize: '0.875rem', fontFamily: 'Monaco, Consolas, monospace' }}>EXECUTIONS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#feca57',
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>47ms</div>
                  <div style={{ color: '#4ecdc4', fontSize: '0.875rem', fontFamily: 'Monaco, Consolas, monospace' }}>AVG LATENCY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ 
        padding: '8rem 2rem', 
        background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#a855f7',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '2rem'
            }}>
              ✨ Características premium
            </div>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '900', 
              color: '#ffffff', 
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              Todo lo que necesitas para{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                automatizar
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#cbd5e1', 
              maxWidth: '48rem', 
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              Una plataforma completa con todas las herramientas necesarias para crear, gestionar y escalar tus automatizaciones.
              <br />
              <span style={{ color: '#a855f7', fontWeight: '600' }}>Diseñada para superar a N8N en cada aspecto.</span>
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem'
          }}>
            {[
              { 
                icon: "⚡", 
                title: "Setup en 5 minutos", 
                description: "Configuración ultra-rápida con IA asistida",
                gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              },
              { 
                icon: "🔗", 
                title: "500+ Integraciones", 
                description: "Conecta con todas tus herramientas favoritas",
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
              },
              { 
                icon: "🚀", 
                title: "Escalabilidad Infinita", 
                description: "Crece sin límites con infraestructura cloud",
                gradient: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)"
              },
              { 
                icon: "🧠", 
                title: "IA Avanzada", 
                description: "Inteligencia artificial que aprende de ti",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)"
              },
              { 
                icon: "⚙️", 
                title: "Automatización Inteligente", 
                description: "Workflows que se optimizan automáticamente",
                gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
              },
              { 
                icon: "👥", 
                title: "Colaboración en Tiempo Real", 
                description: "Trabaja en equipo con herramientas avanzadas",
                gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
              },
              { 
                icon: "🎯", 
                title: "Objetivos Inteligentes", 
                description: "IA que te ayuda a alcanzar tus metas",
                gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
              },
              { 
                icon: "🌐", 
                title: "API de Clase Mundial", 
                description: "Documentación perfecta y ejemplos en vivo",
                gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              },
              { 
                icon: "🔒", 
                title: "Seguridad Enterprise", 
                description: "Certificaciones SOC2, GDPR y más",
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
              },
              { 
                icon: "📊", 
                title: "Analytics Predictivos", 
                description: "Insights que anticipan el futuro",
                gradient: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)"
              },
              { 
                icon: "💬", 
                title: "Tiempo Real", 
                description: "Notificaciones instantáneas y sincronización",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)"
              },
              { 
                icon: "✨", 
                title: "Magia de la IA", 
                description: "Asistente que entiende tu negocio",
                gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: feature.gradient,
                  borderRadius: '1.5rem 1.5rem 0 0'
                }} />
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: '#ffffff', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: '#cbd5e1',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {feature.description}
                </p>
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: feature.gradient,
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease'
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ 
        padding: '8rem 2rem', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d1b69 100%)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              color: '#00ffff',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '2rem',
              fontFamily: 'Monaco, Consolas, monospace'
            }}>
              &gt; PRICING MATRIX
            </div>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '900', 
              color: '#ffffff', 
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}>
              Choose Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #00ffff 0%, #ff6b6b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Mission
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#cbd5e1', 
              maxWidth: '48rem', 
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              Scale from startup to enterprise with transparent, usage-based pricing.
              <br />
              <span style={{ 
                color: '#00ffff', 
                fontWeight: '600',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                {/* No hidden fees • Cancel anytime • 14-day free trial */}
              </span>
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Starter Plan */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(135deg, #00ffff 0%, #4ecdc4 100%)',
                borderRadius: '1.5rem 1.5rem 0 0'
              }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  color: '#00ffff',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  STARTER
                </h3>
                <div style={{
                  background: 'rgba(0, 255, 255, 0.1)',
                  color: '#00ffff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  POPULAR
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  $0
                </div>
                <div style={{
                  color: '#4ecdc4',
                  fontSize: '1rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  /month • 1,000 executions
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {[
                  '✓ 5 workflows',
                  '✓ 10 integrations',
                  '✓ Basic AI features',
                  '✓ Email support',
                  '✓ 99.9% uptime SLA'
                ].map((feature, index) => (
                  <li key={index} style={{
                    color: '#cbd5e1',
                    marginBottom: '0.75rem',
                    fontSize: '1rem',
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleGetStarted}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #00ffff 0%, #4ecdc4 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'Monaco, Consolas, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                START FREE
              </button>
            </div>

            {/* Pro Plan */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '2px solid rgba(255, 107, 107, 0.5)',
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: 'scale(1.05)'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                borderRadius: '1.5rem 1.5rem 0 0'
              }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  color: '#ff6b6b',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  PRO
                </h3>
                <div style={{
                  background: 'rgba(255, 107, 107, 0.2)',
                  color: '#ff6b6b',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  RECOMMENDED
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  $99
                </div>
                <div style={{
                  color: '#4ecdc4',
                  fontSize: '1rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  /month • 100,000 executions
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {[
                  '✓ Unlimited workflows',
                  '✓ 50+ integrations',
                  '✓ Advanced AI features',
                  '✓ Priority support',
                  '✓ 99.99% uptime SLA',
                  '✓ Team collaboration',
                  '✓ Custom webhooks'
                ].map((feature, index) => (
                  <li key={index} style={{
                    color: '#cbd5e1',
                    marginBottom: '0.75rem',
                    fontSize: '1rem',
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleGetStarted}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'Monaco, Consolas, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                UPGRADE NOW
              </button>
            </div>

            {/* Enterprise Plan */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%)',
                borderRadius: '1.5rem 1.5rem 0 0'
              }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  color: '#4ecdc4',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  ENTERPRISE
                </h3>
                <div style={{
                  background: 'rgba(78, 205, 196, 0.1)',
                  color: '#4ecdc4',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  CUSTOM
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  CUSTOM
                </div>
                <div style={{
                  color: '#4ecdc4',
                  fontSize: '1rem',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  /month • Unlimited executions
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {[
                  '✓ Everything in Pro',
                  '✓ Custom integrations',
                  '✓ Dedicated support',
                  '✓ 99.99% uptime SLA',
                  '✓ On-premise deployment',
                  '✓ Custom SLAs',
                  '✓ Security audit'
                ].map((feature, index) => (
                  <li key={index} style={{
                    color: '#cbd5e1',
                    marginBottom: '0.75rem',
                    fontSize: '1rem',
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleContactSales}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'Monaco, Consolas, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                CONTACT SALES
              </button>
            </div>
          </div>

          {/* Enterprise Features */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: '#00ffff',
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              fontFamily: 'Monaco, Consolas, monospace'
            }}>
              ENTERPRISE FEATURES
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              {[
                'SOC2 Type II',
                'GDPR Compliant',
                'HIPAA Ready',
                'SSO Integration',
                'Custom Branding',
                'Dedicated Infrastructure'
              ].map((feature, index) => (
                <div key={index} style={{
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  fontFamily: 'Monaco, Consolas, monospace',
                  padding: '1rem',
                  background: 'rgba(0, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(0, 255, 255, 0.1)'
                }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          animation: 'rotate 20s linear infinite'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '1rem',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              Números que hablan por sí solos
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              La confianza de miles de empresas que ya automatizaron su futuro
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '3rem', 
            textAlign: 'center' 
          }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                fontWeight: '900', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>10K+</div>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>Usuarios activos</div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                fontWeight: '900', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>50M+</div>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>Workflows ejecutados</div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                fontWeight: '900', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>99.9%</div>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>Uptime garantizado</div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                fontWeight: '900', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>24/7</div>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>Soporte premium</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '8rem 2rem', 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite reverse',
          zIndex: 1
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a855f7',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              🚀 ¿Listo para el futuro?
            </div>
            
            <h2 style={{ 
              fontSize: '4rem', 
              fontWeight: '900', 
              color: '#ffffff', 
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              ¿Cansado de{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                automatizaciones complejas
              </span>
              ?
            </h2>
            
            <p style={{ 
              fontSize: '1.5rem', 
              color: '#cbd5e1', 
              marginBottom: '3rem', 
              lineHeight: '1.7',
              maxWidth: '56rem',
              margin: '0 auto 3rem auto'
            }}>
              La mayoría de las plataformas de automatización son lentas, difíciles de usar y requieren conocimientos técnicos avanzados.
              <br />
              <span style={{ color: '#a855f7', fontWeight: '600' }}>Stack21 cambia todo eso.</span>
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '2rem', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}>
              <button 
                onClick={handleGetStarted}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1.5rem',
                  padding: '1.5rem 3rem',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                <span style={{ position: 'relative', zIndex: 2 }}>🚀 Comenzar ahora</span>
              </button>
              <button 
                onClick={handleContactSales}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '2px solid rgba(99, 102, 241, 0.5)',
                  borderRadius: '1.5rem',
                  padding: '1.5rem 3rem',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                📞 Contactar ventas
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              opacity: '0.8'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>SOC2 Type II</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌍</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>GDPR Compliant</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>99.9% Uptime</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>Mejor que N8N</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)', 
        color: 'white', 
        padding: '6rem 2rem 3rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #6366f1 50%, transparent 100%)',
          animation: 'shimmer 3s ease-in-out infinite'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '4rem',
            marginBottom: '4rem'
          }}>
            <div style={{ maxWidth: '400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>⚡</span>
                </div>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Stack21</span>
              </div>
              <p style={{ 
                color: '#cbd5e1', 
                fontSize: '1.125rem',
                lineHeight: '1.7',
                marginBottom: '2rem'
              }}>
                La plataforma de automatización más avanzada y fácil de usar. 
                <br />
                <span style={{ color: '#a855f7', fontWeight: '600' }}>Diseñada para superar a N8N en cada aspecto.</span>
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>🐦</span>
                </div>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>💼</span>
                </div>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>📱</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{ 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                color: '#ffffff'
              }}>Producto</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/features" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>✨ Características</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/pricing" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>💰 Precios</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/integrations" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>🔗 Integraciones</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/api" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>🌐 API</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                color: '#ffffff'
              }}>Recursos</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/docs" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>📚 Documentación</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/blog" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>📝 Blog</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/support" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>🆘 Soporte</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/community" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>👥 Comunidad</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                color: '#ffffff'
              }}>Empresa</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/about" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>🏢 Acerca de</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/contact" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>📞 Contacto</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/careers" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>💼 Carreras</a>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <a href="/press" style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>📰 Prensa</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            borderTop: '1px solid rgba(99, 102, 241, 0.2)', 
            marginTop: '3rem', 
            paddingTop: '2rem', 
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ 
              color: '#94a3b8',
              fontSize: '0.875rem',
              margin: 0
            }}>
              &copy; 2024 Stack21. Todos los derechos reservados.
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <a href="/privacy" style={{ 
                color: '#94a3b8', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}>Privacidad</a>
              <a href="/terms" style={{ 
                color: '#94a3b8', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}>Términos</a>
              <a href="/cookies" style={{ 
                color: '#94a3b8', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
