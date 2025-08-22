"use client"
import React, { useEffect, useState } from "react"
import { createClient } from '@/utils/supabase/client'
import { Scores } from "@/lib/types/scores"
import { formatTime } from "@/utils/time/time"
import { MachineIndicator } from "../indicator/indicator"
import { UUID } from "crypto"

interface AthleteHistoryProps {
    athleteId: UUID
    typeId: number
    currentScoreId: UUID
}

export function AthleteHistory({ athleteId, typeId, currentScoreId }: AthleteHistoryProps) {
    const [historicalScores, setHistoricalScores] = useState<Scores[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        const fetchAthleteHistory = async () => {
            setLoading(true)
            setError(null)

            try {
                const { data: scores, error } = await supabase
                    .from('scores')
                    .select('*, athlete:athlete(*), type:type(*), dates:dateId(*)')
                    .eq('athlete', athleteId)
                    .eq('type', typeId)
                    .neq('id', currentScoreId)
                    .limit(10)

                if (error) {
                    console.error('Error fetching athlete history:', error)
                    setError('Failed to load athlete history')
                    return
                }

                setHistoricalScores(scores || [])
            } catch (err) {
                console.error('Error loading athlete history:', err)
                setError('Failed to load athlete history')
            } finally {
                setLoading(false)
            }
        }

        fetchAthleteHistory()
    }, [athleteId, typeId, currentScoreId, supabase])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-4">
                <div className="text-sm text-gray-600">Loading history...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-4">
                <div className="text-sm text-red-600">{error}</div>
            </div>
        )
    }

    if (historicalScores.length === 0) {
        return (
            <div className="text-center py-4">
                <div className="text-sm text-gray-500">No previous times found for this workout type.</div>
            </div>
        )
    }

    const fastestTime = historicalScores.length > 0 
        ? Math.min(...historicalScores.map(score => score.totalTime).filter(time => time != null))
        : null;

    return (
        <div className="space-y-1">
            {/* Compact inline display */}
            <div className="flex flex-wrap gap-2">
                {historicalScores.slice(0, 8).map((score) => {
                    const isFastest = fastestTime && score.totalTime === fastestTime;
                    
                    return (
                        <div
                            key={score.id}
                            className={`flex flex-col px-3 py-2 rounded-lg text-xs transition-colors ${
                                isFastest 
                                    ? 'bg-green-100 border border-green-300 hover:bg-green-150' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`font-mono font-medium ${
                                    isFastest ? 'text-green-800' : ''
                                }`}>
                                    {formatTime(score.totalTime)}
                                </span>
                                {score.machineType && (
                                    <MachineIndicator machine={score.machineType} />
                                )}
                            </div>
                            <span className={`text-xs mt-1 ${
                                isFastest ? 'text-green-600' : 'text-gray-500'
                            }`}>
                                {score.date && new Date(score.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: '2-digit'
                                })}
                            </span>
                        </div>
                    )
                })}
            </div>

            {historicalScores.length === 0 && (
                <div className="text-xs text-red-700 italic">
                    No previous times found
                </div>
            )}
        </div>
    )
}