#!/usr/bin/env node

/**
 * Script para configurar productos y precios en Stripe para Stack21
 * 
 * Uso:
 *   node scripts/setup-stripe-products.js
 * 
 * Asegúrate de tener STRIPE_SECRET_KEY configurada en tu .env
 */

const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const PRODUCTS = [
  {
    id: 'stack21-free',
    name: 'Stack21 Free',
    description: 'Plan gratuito para empezar con tu tienda online',
    features: [
      'Mini-tienda y catálogo',
      'Agente AI básico (texto)',
      '20 chats/mes',
      '1,000 tokens/día',
      'Sin voz'
    ],
    prices: [
      {
        id: 'price_free',
        amount: 0,
        currency: 'eur',
        interval: 'month',
        nickname: 'Free Plan'
      }
    ]
  },
  {
    id: 'stack21-pro',
    name: 'Stack21 Pro',
    description: 'Plan profesional para hacer crecer tu negocio',
    features: [
      'Todo lo del Free',
      'Agente AI completo',
      '1,000 chats/mes',
      'Cache FAQ',
      'Generación de marketing básica',
      'Soporte email'
    ],
    prices: [
      {
        id: 'price_pro',
        amount: 1500, // €15.00 en centavos
        currency: 'eur',
        interval: 'month',
        nickname: 'Pro Monthly'
      }
    ]
  },
  {
    id: 'stack21-premium',
    name: 'Stack21 Premium',
    description: 'Plan premium para empresas en crecimiento',
    features: [
      'Todo lo del Pro',
      'Agente AI con voz',
      '200 min/mes de voz',
      'Generación de marketing extendida',
      'Soporte prioritario'
    ],
    prices: [
      {
        id: 'price_premium',
        amount: 2900, // €29.00 en centavos
        currency: 'eur',
        interval: 'month',
        nickname: 'Premium Monthly'
      }
    ]
  }
];

const ADDONS = [
  {
    id: 'addon-1000-chats',
    name: 'Pack de 1,000 chats adicionales',
    description: 'Añade 1,000 chats más a tu plan mensual',
    prices: [
      {
        id: 'price_addon_chats',
        amount: 500, // €5.00 en centavos
        currency: 'eur',
        interval: null, // One-time
        nickname: '1000 Chats Addon'
      }
    ]
  },
  {
    id: 'addon-60-voice-minutes',
    name: '60 minutos de voz adicionales',
    description: 'Añade 60 minutos de voz a tu plan mensual',
    prices: [
      {
        id: 'price_addon_voice',
        amount: 500, // €5.00 en centavos
        currency: 'eur',
        interval: null, // One-time
        nickname: '60 Voice Minutes Addon'
      }
    ]
  }
];

async function createOrUpdateProduct(product) {
  try {
    // Buscar producto existente
    const existingProducts = await stripe.products.list({
      active: true,
      limit: 100
    });

    const existingProduct = existingProducts.data.find(p => p.id === product.id);

    let stripeProduct;
    if (existingProduct) {
      console.log(`✅ Producto ${product.id} ya existe, actualizando...`);
      stripeProduct = await stripe.products.update(existingProduct.id, {
        name: product.name,
        description: product.description,
        metadata: {
          features: JSON.stringify(product.features),
          plan_type: product.id.split('-')[1] // free, pro, premium
        }
      });
    } else {
      console.log(`🆕 Creando producto ${product.id}...`);
      stripeProduct = await stripe.products.create({
        id: product.id,
        name: product.name,
        description: product.description,
        metadata: {
          features: JSON.stringify(product.features),
          plan_type: product.id.split('-')[1]
        }
      });
    }

    // Crear o actualizar precios
    for (const price of product.prices) {
      const existingPrices = await stripe.prices.list({
        product: stripeProduct.id,
        active: true
      });

      const existingPrice = existingPrices.data.find(p => p.id === price.id);

      if (existingPrice) {
        console.log(`  ✅ Precio ${price.id} ya existe`);
      } else {
        console.log(`  🆕 Creando precio ${price.id}...`);
        await stripe.prices.create({
          id: price.id,
          product: stripeProduct.id,
          unit_amount: price.amount,
          currency: price.currency,
          recurring: price.interval ? {
            interval: price.interval
          } : undefined,
          nickname: price.nickname,
          metadata: {
            product_id: product.id
          }
        });
      }
    }

    return stripeProduct;
  } catch (error) {
    console.error(`❌ Error procesando producto ${product.id}:`, error.message);
    throw error;
  }
}

async function setupWebhook() {
  try {
    const webhooks = await stripe.webhooks.list();
    const existingWebhook = webhooks.data.find(w => 
      w.url.includes('/api/billing/webhook')
    );

    if (existingWebhook) {
      console.log('✅ Webhook ya existe');
      return existingWebhook;
    }

    console.log('🆕 Creando webhook...');
    const webhook = await stripe.webhooks.create({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/billing/webhook`,
      enabled_events: [
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'customer.subscription.trial_will_end'
      ]
    });

    console.log(`✅ Webhook creado: ${webhook.id}`);
    console.log(`🔑 Webhook secret: ${webhook.secret}`);
    console.log('⚠️  Añade este secret a tu .env como STRIPE_WEBHOOK_SECRET');
    
    return webhook;
  } catch (error) {
    console.error('❌ Error creando webhook:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Configurando productos de Stripe para Stack21...\n');

  try {
    // Verificar configuración
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY no está configurada en .env');
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.log('⚠️  NEXT_PUBLIC_APP_URL no está configurada, usando localhost');
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    }

    // Crear productos principales
    console.log('📦 Creando productos principales...');
    for (const product of PRODUCTS) {
      await createOrUpdateProduct(product);
    }

    // Crear add-ons
    console.log('\n🎁 Creando add-ons...');
    for (const addon of ADDONS) {
      await createOrUpdateProduct(addon);
    }

    // Configurar webhook
    console.log('\n🔗 Configurando webhook...');
    await setupWebhook();

    console.log('\n✅ Configuración completada!');
    console.log('\n📋 Resumen de configuración:');
    console.log('   - Productos creados:', PRODUCTS.length);
    console.log('   - Add-ons creados:', ADDONS.length);
    console.log('   - Webhook configurado');
    
    console.log('\n🔧 Próximos pasos:');
    console.log('   1. Copia el webhook secret a tu .env');
    console.log('   2. Actualiza el mapeo de precios en tu código');
    console.log('   3. Prueba las suscripciones en modo test');
    console.log('   4. Configura el modo live cuando estés listo');

  } catch (error) {
    console.error('\n❌ Error en la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  PRODUCTS,
  ADDONS,
  createOrUpdateProduct,
  setupWebhook
};
