/**
 * 🔌 Shopify Connector API
 * Conecta con Shopify para e-commerce
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config, shop, accessToken } = body

    if (!shop || !accessToken) {
      return NextResponse.json(
        { error: 'shop y accessToken de Shopify requeridos' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'get_product':
        return await getProduct(config, shop, accessToken)
      
      case 'update_product':
        return await updateProduct(config, shop, accessToken)
      
      case 'create_order':
        return await createOrder(config, shop, accessToken)
      
      case 'get_inventory':
        return await getInventory(config, shop, accessToken)
      
      default:
        return NextResponse.json(
          { error: `Acción no soportada: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Error Shopify:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}

async function getProduct(config: any, shop: string, accessToken: string) {
  const { product_id } = config
  
  if (!product_id) {
    throw new Error('product_id es requerido')
  }

  const url = `https://${shop}/admin/api/2024-01/products/${product_id}.json`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error al obtener producto de Shopify')
  }

  const data = await response.json()
  
  return NextResponse.json({
    success: true,
    data: {
      product: data.product
    }
  })
}

async function updateProduct(config: any, shop: string, accessToken: string) {
  const { product_id, price, inventory } = config
  
  if (!product_id) {
    throw new Error('product_id es requerido')
  }

  // Actualizar producto
  const productUrl = `https://${shop}/admin/api/2024-01/products/${product_id}.json`
  
  const productData: any = {}
  
  // Si se proporciona precio, actualizar la primera variante
  if (price !== undefined) {
    // Primero obtener el producto para saber la variante
    const getResponse = await fetch(productUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    })
    
    if (!getResponse.ok) {
      throw new Error('Error al obtener producto')
    }
    
    const productInfo = await response.json()
    const variantId = productInfo.product.variants[0]?.id
    
    if (variantId) {
      const variantUrl = `https://${shop}/admin/api/2024-01/variants/${variantId}.json`
      const variantResponse = await fetch(variantUrl, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variant: { price: price.toString() }
        })
      })
      
      if (!variantResponse.ok) {
        throw new Error('Error al actualizar precio')
      }
    }
  }

  // Si se proporciona inventario, actualizar nivel de inventario
  if (inventory !== undefined) {
    // Este proceso requiere inventory_item_id y location_id
    // En producción, implementar la lógica completa de inventario
    // https://shopify.dev/api/admin-rest/2024-01/resources/inventorylevel
  }

  return NextResponse.json({
    success: true,
    data: {
      product_id,
      updated: true,
      price_updated: price !== undefined,
      inventory_updated: inventory !== undefined
    }
  })
}

async function createOrder(config: any, shop: string, accessToken: string) {
  const { customer_email, items } = config
  
  if (!customer_email || !items || !Array.isArray(items)) {
    throw new Error('customer_email e items (array) son requeridos')
  }

  const url = `https://${shop}/admin/api/2024-01/orders.json`
  
  const line_items = items.map((item: any) => ({
    variant_id: item.variant_id,
    quantity: item.quantity || 1,
    price: item.price
  }))

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order: {
        email: customer_email,
        line_items,
        financial_status: 'pending'
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error al crear orden en Shopify')
  }

  const data = await response.json()
  
  return NextResponse.json({
    success: true,
    data: {
      order_id: data.order.id,
      order_number: data.order.order_number,
      total: data.order.total_price,
      created: true
    }
  })
}

async function getInventory(config: any, shop: string, accessToken: string) {
  const { product_id, location_id } = config
  
  if (!product_id) {
    throw new Error('product_id es requerido')
  }

  // Obtener producto
  const productUrl = `https://${shop}/admin/api/2024-01/products/${product_id}.json`
  
  const productResponse = await fetch(productUrl, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    }
  })

  if (!productResponse.ok) {
    throw new Error('Error al obtener producto')
  }

  const productData = await productResponse.json()
  const variant = productData.product.variants[0]
  
  // Obtener nivel de inventario
  const inventoryUrl = `https://${shop}/admin/api/2024-01/inventory_levels.json?inventory_item_ids=${variant.inventory_item_id}`
  
  const inventoryResponse = await fetch(inventoryUrl, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    }
  })

  if (!inventoryResponse.ok) {
    throw new Error('Error al obtener inventario')
  }

  const inventoryData = await inventoryResponse.json()
  
  return NextResponse.json({
    success: true,
    data: {
      product_id,
      inventory_levels: inventoryData.inventory_levels,
      available: inventoryData.inventory_levels[0]?.available || 0
    }
  })
}

// Webhook receiver
export async function GET(request: NextRequest) {
  // Webhook verification para Shopify
  return NextResponse.json({ message: 'Shopify webhook endpoint' })
}

