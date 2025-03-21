"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart2, Award, Plus } from "lucide-react"

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

export function Navbar() {
    const pathname = usePathname()

    function handleClick() {
        console.log('New Test')
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
                                    pathname === item.href ? "text-foreground" : "text-foreground/60",
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <Button size="sm" className="h-8"
                    onClick={handleClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Test
                </Button>

            </div>


        </header>
    )
}

