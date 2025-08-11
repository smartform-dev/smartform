import React from "react"
import { cn } from "@/lib/utils"

const AnimatedLogo = ({ className }: { className?: string }) => {
  return (
    <h1 className={cn("text-9xl font-bold tracking-tighter animate-text-shine", className)}>
      Smartform
    </h1>
  )
}

export default AnimatedLogo
