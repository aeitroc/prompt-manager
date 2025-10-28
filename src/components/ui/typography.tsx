import React from 'react'
import { cn } from '@/lib/utils'
import { typography, colors } from '@/lib/design-tokens'

export interface TypographyProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-lg' | 'body-sm' | 'caption' | 'label' | 'code'
  weight?: keyof typeof typography.fontWeight
  color?: 'primary' | 'secondary' | 'muted' | 'subtle' | 'brand' | 'success' | 'warning' | 'error'
  align?: 'left' | 'center' | 'right' | 'justify'
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  truncate?: boolean
  className?: string
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({
    variant = 'body',
    weight,
    color = 'primary',
    align = 'left',
    transform = 'none',
    truncate = false,
    className,
    children,
    as: Component = 'span'
  }, ref) => {
    const getVariantClasses = (variant: string) => {
      switch (variant) {
        case 'display':
          return 'text-4xl md:text-5xl font-bold leading-tight tracking-tight'
        case 'h1':
          return 'text-3xl md:text-4xl font-bold leading-tight tracking-tight'
        case 'h2':
          return 'text-2xl md:text-3xl font-bold leading-tight tracking-tight'
        case 'h3':
          return 'text-xl md:text-2xl font-semibold leading-tight'
        case 'h4':
          return 'text-lg md:text-xl font-semibold leading-tight'
        case 'body-lg':
          return 'text-base leading-relaxed'
        case 'body':
          return 'text-sm leading-relaxed'
        case 'body-sm':
          return 'text-xs leading-relaxed'
        case 'caption':
          return 'text-xs leading-normal text-txt-muted'
        case 'label':
          return 'text-xs font-medium leading-normal uppercase tracking-wide'
        case 'code':
          return 'font-mono text-xs leading-normal bg-bg-tertiary px-1 py-0.5 rounded'
        default:
          return 'text-sm leading-relaxed'
      }
    }

    const getWeightClasses = (weight?: string) => {
      if (!weight) return ''
      switch (weight) {
        case 'light':
          return 'font-light'
        case 'normal':
          return 'font-normal'
        case 'medium':
          return 'font-medium'
        case 'semibold':
          return 'font-semibold'
        case 'bold':
          return 'font-bold'
        case 'extrabold':
          return 'font-extrabold'
        default:
          return ''
      }
    }

    const getColorClasses = (color: string) => {
      switch (color) {
        case 'primary':
          return 'text-txt-primary'
        case 'secondary':
          return 'text-txt-secondary'
        case 'muted':
          return 'text-txt-muted'
        case 'subtle':
          return 'text-txt-subtle'
        case 'brand':
          return 'text-vscode-blue'
        case 'success':
          return 'text-green-400'
        case 'warning':
          return 'text-yellow-400'
        case 'error':
          return 'text-red-400'
        default:
          return 'text-txt-primary'
      }
    }

    const getAlignClasses = (align: string) => {
      switch (align) {
        case 'left':
          return 'text-left'
        case 'center':
          return 'text-center'
        case 'right':
          return 'text-right'
        case 'justify':
          return 'text-justify'
        default:
          return 'text-left'
      }
    }

    const getTransformClasses = (transform: string) => {
      switch (transform) {
        case 'uppercase':
          return 'uppercase'
        case 'lowercase':
          return 'lowercase'
        case 'capitalize':
          return 'capitalize'
        default:
          return 'normal-case'
      }
    }

    const classes = cn(
      getVariantClasses(variant),
      getWeightClasses(weight),
      getColorClasses(color),
      getAlignClasses(align),
      getTransformClasses(transform),
      {
        'line-clamp-1': truncate,
        'transition-colors duration-150': color !== 'primary',
      },
      className
    )

    return (
      <Component ref={ref} className={classes}>
        {children}
      </Component>
    )
  }
)

Typography.displayName = 'Typography'

// Semantic heading components for better accessibility
export const H1: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="h1" as="h1" />
)

export const H2: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="h2" as="h2" />
)

export const H3: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="h3" as="h3" />
)

export const H4: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="h4" as="h4" />
)

export const Body: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="body" as="p" />
)

export const Caption: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="caption" as="span" />
)

export const Label: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="label" as="label" />
)

export const Code: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography {...props} variant="code" as="code" />
)