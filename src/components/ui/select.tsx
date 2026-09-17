import * as React from 'react'
import { cn } from '@/lib/utils'

function Select({ value, onValueChange, children }: { value: string; onValueChange: (value: string) => void; children: React.ReactNode }) {
  return <div>{React.Children.map(children, (child) => React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ value?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement> }>, { value, onChange: (event) => onValueChange(event.target.value) }) : child)}</div>
}

function SelectTrigger({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm', className)} {...props}>{children}</select>
}

const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => <option value={value}>{children}</option>
const SelectValue = ({ placeholder }: { placeholder?: string }) => <>{placeholder}</>

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
