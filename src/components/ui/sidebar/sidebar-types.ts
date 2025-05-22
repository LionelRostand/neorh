
import { VariantProps } from "class-variance-authority"
import { sidebarMenuButtonVariants } from "./sidebar-menu"
import { ReactNode } from "react"
import { TooltipContent } from "../tooltip"

export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export type SidebarMenuButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentPropsWithoutRef<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>
