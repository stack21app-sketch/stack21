import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirigir a la landing page con waitlist
  redirect('/landing')
}
