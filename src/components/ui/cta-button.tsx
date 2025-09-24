'use client'

import { Button } from '@/components/ui/button'
// import { useAnalytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CTAButtonProps {
  children: React.ReactNode
  href: string
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  icon?: LucideIcon
  ctaId: string
  trackClick?: boolean
  external?: boolean
}

export function CTAButton({
  children,
  href,
  variant = 'default',
  size = 'default',
  className,
  icon: Icon,
  ctaId,
  trackClick = true,
  external = false
}: CTAButtonProps) {
  // const { trackCTAClick } = useAnalytics()
  const pathname = usePathname()

  const handleClick = () => {
    if (trackClick) {
      // trackCTAClick(ctaId, pathname, {
      //   href,
      //   variant,
      //   size,
      //   external
      // })
      console.log('CTA clicked:', ctaId)
    }
  }

  const buttonContent = (
    <>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </>
  )

  if (external) {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={handleClick}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {buttonContent}
        </a>
      </Button>
    )
  }

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleClick}
    >
      <Link href={href}>
        {buttonContent}
      </Link>
    </Button>
  )
}
