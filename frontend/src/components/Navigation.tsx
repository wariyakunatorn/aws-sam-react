import { Link } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { User } from "lucide-react"

export function Navigation() {
  return (
    <NavigationMenu>
      // ...existing items...
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to="/profile" className={navigationMenuTriggerStyle()}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  )
}
