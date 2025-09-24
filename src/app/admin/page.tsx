'use client'

import React from 'react'

export default function AdminPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Panel de Administración</h1>
      <p className="text-gray-600 mt-2">
        Acceso restringido. Usa la URL con ?key= para el primer acceso si no tienes la cookie.
      </p>
    </main>
  )
}


