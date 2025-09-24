'use client'

import { useState } from 'react'
import { useWorkspace } from '@/hooks/use-workspace'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Building2, Plus } from 'lucide-react'

export function WorkspaceSelector() {
  const { currentWorkspace, workspaces, setCurrentWorkspace, loading } = useWorkspace()
  const [open, setOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!currentWorkspace) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <Building2 className="h-4 w-4" />
        <span>Sin workspace</span>
      </div>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between min-w-[200px]">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{currentWorkspace.name}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => {
              setCurrentWorkspace(workspace)
              setOpen(false)
            }}
            className="flex items-center space-x-2"
          >
            <Building2 className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">{workspace.name}</div>
              <div className="text-xs text-gray-500 capitalize">
                {workspace.role.toLowerCase()}
              </div>
            </div>
            {workspace.id === currentWorkspace.id && (
              <div className="h-2 w-2 rounded-full bg-green-500" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => {
            // TODO: Implementar creación de workspace
            console.log('Crear nuevo workspace')
          }}
          className="flex items-center space-x-2 text-blue-600"
        >
          <Plus className="h-4 w-4" />
          <span>Crear workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
