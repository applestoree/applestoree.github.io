import * as React from 'react'
import { cn } from '@/lib/utils'

function Empty({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center', className)} {...props} />
}

export { Empty }
