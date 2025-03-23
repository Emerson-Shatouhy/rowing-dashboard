import Link from "next/link"
import { cn } from "@/lib/utils"
import { BarChart2, Award } from "lucide-react"
import { checkUserClient } from "@/utils/auth/auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
    {
        name: "All Tests",
        href: "/",
        icon: BarChart2,
    },
    {
        name: "All Time Records",
        href: "/personal-records",
        icon: Award,
    },
]

export async function Navbar() {
    const user = await checkUserClient()
    if ('user' in user) {
    } else {
        console.log('No user')
    }


    return (
        <header className="flex p-4 border-b border-gray-200 w-full">
            <div className="flex flex-row justify-between w-full" >
                <div className="flex items-center space-x-4">
                    <Link href="/" className="font-bold text-lg">
                        WPI Rowing Dashboard
                    </Link>
                    <nav className="flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center transition-colors hover:text-foreground/80",

                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                {/* <Button size="sm" className="h-8"
                    onClick={handleClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Test
                </Button> */}
                {'user' in user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>{user.user.user_metadata.full_name}</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <a href="/myScores">My Scores</a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <a href="/signout">Sign Out</a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                )}
            </div>
        </header>
    )
}

