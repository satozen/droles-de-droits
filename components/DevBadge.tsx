// Composant Badge pour marquer les sections en développement
// Utilisé pour indiquer aux utilisateurs qu'une fonctionnalité est en cours de développement
import { motion } from 'framer-motion'

interface DevBadgeProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function DevBadge({ text = 'En développement', size = 'md' }: DevBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 ${sizeClasses[size]} bg-yellow-100 border-2 border-yellow-400 text-yellow-800 font-bold rounded-full shadow-sm`}
    >
      <span className="text-xs">🚧</span>
      {text}
    </motion.span>
  )
}

