"use client";

import React from "react";
import Image from 'next/image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MachineType } from "@/lib/types/scores";


interface MachineIndicatorProps {
    machine: MachineType;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function MachineIndicator({
    machine,
}: MachineIndicatorProps) {
    // Size mapping for different size options

    // Get the appropriate icon based on the machine type
    const getIcon = () => {
        switch (machine) {
            case "static":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Image
                                    src="/ergIcon.png"
                                    alt="Static"
                                    width={50}
                                    height={50}
                                    className="self-end mb-0 px-1"
                                /></TooltipTrigger>
                            <TooltipContent>
                                Static Erg
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                );
            case "dynamic":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Image
                                    src="/dynamicIcon.png"
                                    alt="Dynamic"
                                    width={50}
                                    height={50}
                                    className="self-end mb-0 px-1"
                                /></TooltipTrigger>
                            <TooltipContent>
                                Dynamic
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case "sliders":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Image
                                    src="/sliderIcon.png"
                                    alt="Static"
                                    width={50}
                                    height={50}
                                    className="self-end mb-0 px-1"
                                />   </TooltipTrigger>
                            <TooltipContent>
                                Sliders
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case "berg":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Image
                                    src="/bergIcon.png"
                                    alt="Berg"
                                    width={40}
                                    height={40}
                                    className="self-end mb-0 px-1"
                                />   </TooltipTrigger>
                            <TooltipContent>
                                Berg
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            default:
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Image
                                    src="/ergIcon.png"
                                    alt="Static"
                                    width={50}
                                    height={50}
                                    className="self-end mb-0 px-1"
                                /></TooltipTrigger>
                            <TooltipContent>
                                Static Erg
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
        }
    };

    return (
        <div className="inline-flex items-end justify-center">
            {getIcon()}
        </div>
    );
}
