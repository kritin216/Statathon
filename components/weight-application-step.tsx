"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Zap, BarChart3, Brain, RefreshCw, Lock, Unlock, AlertTriangle } from "lucide-react"

interface WeightApplicationStepProps {
  data: any
  schema: any
  onConfigured: (config: any) => void
  onBack: () => void
}

export function WeightApplicationStep({ data, schema, onConfigured, onBack }: WeightApplicationStepProps) {
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [isGeneratingWeights, setIsGeneratingWeights] = useState(false)
  const [lockedColumns, setLockedColumns] = useState<Set<string>>(new Set())

  // Initialize weights for all columns
  const [columnWeights, setColumnWeights] = useState(() => {
    const weights: Record<string, number> = {}
    const responseColumns = schema?.responseColumns || data.columns.slice(0, 5)
    const equalWeight = 100 / responseColumns.length

    responseColumns.forEach((col: string) => {
      weights[col] = equalWeight
    })

    return weights
  })

  const [aiSuggestions, setAiSuggestions] = useState<Record<string, { weight: number; reason: string }>>({})
  const [weightHistory, setWeightHistory] = useState<Array<Record<string, number>>>([])

  const responseColumns = schema?.responseColumns || data.columns.slice(0, 5)
  const totalWeight = Object.values(columnWeights).reduce((sum, weight) => sum + weight, 0)

  // Update weights proportionally when one changes
  const updateWeight = (column: string, newWeight: number) => {
    if (lockedColumns.has(column)) return

    const oldWeight = columnWeights[column]
    const difference = newWeight - oldWeight
    const otherColumns = responseColumns.filter((col: string) => col !== column && !lockedColumns.has(col))

    if (otherColumns.length === 0) return

    // Calculate how much to adjust other columns
    const adjustmentPerColumn = -difference / otherColumns.length

    const newWeights = { ...columnWeights }
    newWeights[column] = newWeight

    // Adjust other unlocked columns proportionally
    otherColumns.forEach((col: string) => {
      const currentWeight = newWeights[col]
      const newColWeight = Math.max(0, Math.min(100, currentWeight + adjustmentPerColumn))
      newWeights[col] = newColWeight
    })

    // Normalize to ensure total is 100
    const newTotal = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0)
    if (newTotal > 0) {
      Object.keys(newWeights).forEach((col) => {
        newWeights[col] = (newWeights[col] / newTotal) * 100
      })
    }

    setColumnWeights(newWeights)

    // Save to history
    setWeightHistory((prev) => [...prev.slice(-9), columnWeights])
  }

  const toggleColumnLock = (column: string) => {
    const newLocked = new Set(lockedColumns)
    if (newLocked.has(column)) {
      newLocked.delete(column)
    } else {
      newLocked.add(column)
    }
    setLockedColumns(newLocked)
  }

  const generateAIWeights = async () => {
    setIsGeneratingWeights(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI suggestions based on column analysis
    const suggestions: Record<string, { weight: number; reason: string }> = {}
    const mockReasons = [
      "High correlation with target variable",
      "Strong predictive power in similar datasets",
      "Low variance, stable responses",
      "Critical demographic indicator",
      "Primary satisfaction metric",
      "Key performance indicator",
      "High response rate and quality",
    ]

    let remainingWeight = 100
    responseColumns.forEach((col: string, index: number) => {
      const isLast = index === responseColumns.length - 1
      let weight: number

      if (isLast) {
        weight = remainingWeight
      } else {
        // Generate weights based on mock importance
        const baseWeight = Math.random() * 30 + 10 // 10-40 range
        weight = Math.min(baseWeight, remainingWeight - (responseColumns.length - index - 1) * 5)
        remainingWeight -= weight
      }

      suggestions[col] = {
        weight: Math.round(weight * 10) / 10,
        reason: mockReasons[Math.floor(Math.random() * mockReasons.length)],
      }
    })

    setAiSuggestions(suggestions)
    setIsGeneratingWeights(false)
  }

  const applyAIWeights = () => {
    const newWeights: Record<string, number> = {}
    Object.entries(aiSuggestions).forEach(([col, suggestion]) => {
      newWeights[col] = suggestion.weight
    })

    setWeightHistory((prev) => [...prev.slice(-9), columnWeights])
    setColumnWeights(newWeights)
    setIsAutoMode(true)
  }

  const resetWeights = () => {
    const equalWeight = 100 / responseColumns.length
    const resetWeights: Record<string, number> = {}

    responseColumns.forEach((col: string) => {
      resetWeights[col] = equalWeight
    })

    setWeightHistory((prev) => [...prev.slice(-9), columnWeights])
    setColumnWeights(resetWeights)
    setLockedColumns(new Set())
    setIsAutoMode(false)
  }

  const undoLastChange = () => {
    if (weightHistory.length > 0) {
      const lastWeights = weightHistory[weightHistory.length - 1]
      setColumnWeights(lastWeights)
      setWeightHistory((prev) => prev.slice(0, -1))
    }
  }

  const handleContinue = () => {
    const config = {
      columnWeights,
      isAutoMode,
      lockedColumns: Array.from(lockedColumns),
      aiSuggestions,
      totalWeight,
      weightingStrategy: isAutoMode ? "ai_optimized" : "manual",
    }
    onConfigured(config)
  }

  const getWeightColor = (weight: number) => {
    if (weight < 10) return "text-red-600 bg-red-50 dark:bg-red-900/20"
    if (weight < 20) return "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
    if (weight < 30) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
    return "text-green-600 bg-green-50 dark:bg-green-900/20"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Dynamic Weight Application
        </CardTitle>
        <CardDescription>
          Configure column weights for analysis. Use AI suggestions or manual adjustment with dynamic balancing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Control Panel */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isAutoMode}
                  onCheckedChange={setIsAutoMode}
                  disabled={Object.keys(aiSuggestions).length === 0}
                />
                <Label>AI Mode</Label>
              </div>
              <Badge variant={totalWeight === 100 ? "default" : "destructive"}>Total: {totalWeight.toFixed(1)}%</Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={generateAIWeights} disabled={isGeneratingWeights}>
                <Brain className="w-4 h-4 mr-2" />
                {isGeneratingWeights ? "Analyzing..." : "AI Suggest"}
              </Button>
              <Button variant="outline" size="sm" onClick={undoLastChange} disabled={weightHistory.length === 0}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" size="sm" onClick={resetWeights}>
                Reset
              </Button>
            </div>
          </div>

          <Tabs defaultValue="weights" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weights">Weight Configuration</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="weights" className="space-y-4">
              {/* Weight Sliders */}
              <div className="space-y-6">
                {responseColumns.map((column: string) => {
                  const weight = columnWeights[column] || 0
                  const isLocked = lockedColumns.has(column)
                  const aiSuggestion = aiSuggestions[column]

                  return (
                    <div key={column} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleColumnLock(column)}
                            className="p-1 h-8 w-8"
                          >
                            {isLocked ? (
                              <Lock className="w-4 h-4 text-red-600" />
                            ) : (
                              <Unlock className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Label className="font-medium">{column}</Label>
                          {aiSuggestion && (
                            <Badge variant="outline" className="text-xs">
                              AI: {aiSuggestion.weight.toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getWeightColor(weight)}`}>
                          {weight.toFixed(1)}%
                        </div>
                      </div>

                      <div className="px-3">
                        <Slider
                          value={[weight]}
                          onValueChange={([value]) => updateWeight(column, value)}
                          min={0}
                          max={100}
                          step={0.1}
                          disabled={isLocked}
                          className={`${isLocked ? "opacity-50" : ""}`}
                        />
                      </div>

                      {aiSuggestion && (
                        <div className="px-3 text-xs text-muted-foreground">AI Reasoning: {aiSuggestion.reason}</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Weight Distribution Visualization */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Weight Distribution</h4>
                <div className="space-y-2">
                  {responseColumns.map((column: string) => {
                    const weight = columnWeights[column] || 0
                    const percentage = (weight / 100) * 100

                    return (
                      <div key={column} className="flex items-center gap-3">
                        <div className="w-24 text-sm font-medium truncate">{column}</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-12 text-sm text-right">{weight.toFixed(1)}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {totalWeight !== 100 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Total weight is {totalWeight.toFixed(1)}%. Adjust weights to equal 100% for optimal analysis.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-4">
              {Object.keys(aiSuggestions).length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No AI Analysis Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate AI weight suggestions to see detailed insights about your columns.
                  </p>
                  <Button onClick={generateAIWeights} disabled={isGeneratingWeights}>
                    <Brain className="w-4 h-4 mr-2" />
                    {isGeneratingWeights ? "Analyzing..." : "Generate AI Insights"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">AI Weight Recommendations</h4>
                    <Button onClick={applyAIWeights} size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Apply AI Weights
                    </Button>
                  </div>

                  {Object.entries(aiSuggestions).map(([column, suggestion]) => (
                    <div key={column} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{column}</h5>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {suggestion.weight.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${suggestion.weight}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleContinue} disabled={Math.abs(totalWeight - 100) > 0.1}>
              Continue to Visualization
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
