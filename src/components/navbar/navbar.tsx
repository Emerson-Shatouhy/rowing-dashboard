import Link from "next/link"
import { cn } from "@/lib/utils"
import { BarChart2, Award, Medal } from "lucide-react"
import { checkUserClient, getSignedInAthlete } from "@/utils/auth/auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Athlete } from "@/lib/types/athlete"

const navItems = [
    {
        name: "All Tests",
        href: "/",
        icon: BarChart2,
    },
    {
        name: "All Time Records",
        href: "/allTimeRecords",
        icon: Medal,
    },
]

export async function Navbar() {
    const user = await checkUserClient()
    const athleteResponse = await getSignedInAthlete()
    if ('error' in athleteResponse) {
        console.error('Failed to fetch athlete data:', athleteResponse.error)
    }
    const athleteData: Athlete = athleteResponse

    if ('user' in user) {

    } else {
        console.log('No user')
    }


    return (
        <header className="flex p-4 border-b border-red-900 w-full bg-red-800 opacity-89 text-white">
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
                <div className="flex items-center space-x-4">
                    {'user' in user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger>{user.user.user_metadata.full_name}</DropdownMenuTrigger>
                            <DropdownMenuContent>

                                {athleteData.coxswain && (
                                    <>
                                        <DropdownMenuItem>
                                            <a href="/manage-test">Manage Test</a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <a href="/roster">Manage Rosters</a>
                                        </DropdownMenuItem>
                                    </>
                                ) || (
                                        <DropdownMenuItem>
                                            <a href="/my-scores">My Scores</a>
                                        </DropdownMenuItem>
                                    )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <a href="/signout">Sign Out</a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                </div>
            </div>
        </header>
    )
}

