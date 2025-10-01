import { useEffect, useState } from 'react';

/**
 * Hook para verificar si estamos en el cliente
 * Útil para evitar errores de hidratación con contenido que difiere entre servidor y cliente
 */
export function useClientOnly(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook para obtener un valor solo en el cliente
 * Útil para evitar errores de hidratación
 */
export function useClientValue<T>(clientValue: T, serverValue: T): T {
  const [value, setValue] = useState(serverValue);
  const isClient = useClientOnly();

  useEffect(() => {
    if (isClient) {
      setValue(clientValue);
    }
  }, [isClient, clientValue]);

  return value;
}