'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { LucideIcon } from 'lucide-react'

interface AnimatedCardProps {
  icon: LucideIcon
  title: string
  description: string
  content: string
  badge?: string
  delay?: number
}

export function AnimatedCard({ 
  icon: Icon, 
  title, 
  description, 
  content, 
  badge,
  delay = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-3">{description}</CardDescription>
          <p className="text-sm text-muted-foreground">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
