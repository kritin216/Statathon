"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Trash2, AlertTriangle, Target, CheckCircle, Clock, TrendingUp, Settings, Play } from "lucide-react"

interface CleaningModulesStepProps {
  data: any
  schema: any
  onConfigured: (config: any) => void
  onBack: () => void
}

export function CleaningModulesStep({ data, schema, onConfigured, onBack }: CleaningModulesStepProps) {
  const [activeModules, setActiveModules] = useState({
    deduplication: true,
    missingValues: true,
    outliers: true,
    invalidData: false,
    straightLiners: true,
    speeders: true,
  })

  const [moduleConfig, setModuleConfig] = useState({
    deduplication: {
      method: "fuzzy",
      threshold: 0.85,
      keyColumns: schema?.identifierColumns || [],
    },
    missingValues: {
      method: "multiple_imputation",
      iterations: 5,
      threshold: 0.5,
    },
    outliers: {
      method: "isolation_forest",
      contamination: 0.1,
      sensitivity: 0.8,
    },
    invalidData: {
      validationFile: null,
      strictMode: false,
      tolerance: 0.95,
    },
    straightLiners: {
      consecutiveThreshold: 5,
      varianceThreshold: 0.1,
      columns: schema?.responseColumns || [],
    },
    speeders: {
      minTimeSeconds: 30,
      maxTimeSeconds: 3600,
      timeColumn: "completion_time",
    },
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [results, setResults] = useState<any>(null)

  const updateModuleConfig = (module: string, field: string, value: any) => {
    setModuleConfig((prev) => ({
      ...prev,
      [module]: {
        ...prev[module as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const toggleModule = (module: string) => {
    setActiveModules((prev) => ({
      ...prev,
      [module]: !prev[module as keyof typeof prev],
    }))
  }

  const runCleaning = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)

    const steps = Object.entries(activeModules).filter(([_, active]) => active)
    const totalSteps = steps.length

    const mockResults = {
      originalRows: data.rows,
      processedRows: data.rows,
      removedRows: 0,
      modifiedRows: 0,
      moduleResults: {} as any,
    }

    for (let i = 0; i < steps.length; i++) {
      const [moduleName] = steps[i]
      setProcessingStep(getModuleDisplayName(moduleName))

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock results for each module
      switch (moduleName) {
        case "deduplication":
          mockResults.moduleResults.deduplication = {
            duplicatesFound: 23,
            duplicatesRemoved: 23,
            method: moduleConfig.deduplication.method,
          }
          mockResults.removedRows += 23
          break
        case "missingValues":
          mockResults.moduleResults.missingValues = {
            cellsImputed: 156,
            columnsAffected: 4,
            method: moduleConfig.missingValues.method,
          }
          mockResults.modifiedRows += 89
          break
        case "outliers":
          mockResults.moduleResults.outliers = {
            outliersDetected: 34,
            outliersRemoved: 12,
            outliersFlagged: 22,
            method: moduleConfig.outliers.method,
          }
          mockResults.removedRows += 12
          break
        case "straightLiners":
          mockResults.moduleResults.straightLiners = {
            straightLinersDetected: 18,
            straightLinersRemoved: 18,
            threshold: moduleConfig.straightLiners.consecutiveThreshold,
          }
          mockResults.removedRows += 18
          break
        case "speeders":
          mockResults.moduleResults.speeders = {
            speedersDetected: 45,
            speedersRemoved: 45,
            minTime: moduleConfig.speeders.minTimeSeconds,
            maxTime: moduleConfig.speeders.maxTimeSeconds,
          }
          mockResults.removedRows += 45
          break
      }

      setProcessingProgress(((i + 1) / totalSteps) * 100)
    }

    mockResults.processedRows = mockResults.originalRows - mockResults.removedRows
    setResults(mockResults)
    setIsProcessing(false)
  }

  const getModuleDisplayName = (module: string) => {
    const names: Record<string, string> = {
      deduplication: "Removing Duplicates",
      missingValues: "Handling Missing Values",
      outliers: "Detecting Outliers",
      invalidData: "Validating Data",
      straightLiners: "Detecting Straight-Liners",
      speeders: "Detecting Speeders",
    }
    return names[module] || module
  }

  const handleContinue = () => {
    const config = {
      activeModules,
      moduleConfig,
      results,
    }
    onConfigured(config)
  }

  if (results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Data Cleaning Complete
          </CardTitle>
          <CardDescription>Your data has been successfully cleaned using the selected modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{results.originalRows.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Original Rows</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{results.processedRows.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Clean Rows</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{results.removedRows.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Removed</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{results.modifiedRows.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Modified</div>
              </div>
            </div>

            {/* Module Results */}
            <div className="space-y-4">
              <h4 className="font-medium">Module Results</h4>
              {Object.entries(results.moduleResults).map(([module, result]: [string, any]) => (
                <div key={module} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{getModuleDisplayName(module)}</h5>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {module === "deduplication" &&
                      `Found and removed ${result.duplicatesFound} duplicates using ${result.method} matching`}
                    {module === "missingValues" &&
                      `Imputed ${result.cellsImputed} missing values across ${result.columnsAffected} columns using ${result.method}`}
                    {module === "outliers" &&
                      `Detected ${result.outliersDetected} outliers, removed ${result.outliersRemoved}, flagged ${result.outliersFlagged} using ${result.method}`}
                    {module === "straightLiners" &&
                      `Detected and removed ${result.straightLinersDetected} straight-line responses (${result.threshold}+ consecutive identical answers)`}
                    {module === "speeders" &&
                      `Detected and removed ${result.speedersDetected} responses outside time range (${result.minTime}-${result.maxTime}s)`}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleContinue}>Continue to Weight Application</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 animate-spin" />
            Processing Data
          </CardTitle>
          <CardDescription>Running selected cleaning modules on your dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">{processingStep}</div>
              <Progress value={processingProgress} className="mb-4" />
              <div className="text-sm text-muted-foreground">{Math.round(processingProgress)}% complete</div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please don't close this window while processing is in progress. This may take a few minutes for large
                datasets.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Data Cleaning Modules
        </CardTitle>
        <CardDescription>Configure and apply AI-powered cleaning modules to improve your data quality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules">Select Modules</TabsTrigger>
              <TabsTrigger value="configure">Configure Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-4">
              {/* Module Selection */}
              <div className="grid gap-4">
                {/* Deduplication */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Deduplication</h4>
                      <p className="text-sm text-muted-foreground">Remove duplicate records using custom algorithms</p>
                    </div>
                  </div>
                  <Switch checked={activeModules.deduplication} onCheckedChange={() => toggleModule("deduplication")} />
                </div>

                {/* Missing Values */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Missing Value Imputation</h4>
                      <p className="text-sm text-muted-foreground">
                        Handle missing data using advanced imputation methods
                      </p>
                    </div>
                  </div>
                  <Switch checked={activeModules.missingValues} onCheckedChange={() => toggleModule("missingValues")} />
                </div>

                {/* Outliers */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Outlier Detection</h4>
                      <p className="text-sm text-muted-foreground">Identify and handle statistical outliers</p>
                    </div>
                  </div>
                  <Switch checked={activeModules.outliers} onCheckedChange={() => toggleModule("outliers")} />
                </div>

                {/* Invalid Data */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-medium">Invalid Data Validation</h4>
                      <p className="text-sm text-muted-foreground">Validate against reference data (optional)</p>
                    </div>
                  </div>
                  <Switch checked={activeModules.invalidData} onCheckedChange={() => toggleModule("invalidData")} />
                </div>

                {/* Straight Liners */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Straight-Liner Detection</h4>
                      <p className="text-sm text-muted-foreground">
                        Identify responses with identical consecutive answers
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={activeModules.straightLiners}
                    onCheckedChange={() => toggleModule("straightLiners")}
                  />
                </div>

                {/* Speeders */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="font-medium">Speeder Detection</h4>
                      <p className="text-sm text-muted-foreground">Remove responses completed too quickly or slowly</p>
                    </div>
                  </div>
                  <Switch checked={activeModules.speeders} onCheckedChange={() => toggleModule("speeders")} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="configure" className="space-y-6">
              {/* Deduplication Config */}
              {activeModules.deduplication && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Deduplication Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Matching Method</Label>
                      <Select
                        value={moduleConfig.deduplication.method}
                        onValueChange={(value) => updateModuleConfig("deduplication", "method", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exact">Exact Match</SelectItem>
                          <SelectItem value="fuzzy">Fuzzy Match</SelectItem>
                          <SelectItem value="phonetic">Phonetic Match</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Similarity Threshold: {moduleConfig.deduplication.threshold}</Label>
                      <Slider
                        value={[moduleConfig.deduplication.threshold]}
                        onValueChange={([value]) => updateModuleConfig("deduplication", "threshold", value)}
                        min={0.5}
                        max={1}
                        step={0.05}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Missing Values Config */}
              {activeModules.missingValues && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Missing Values Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Imputation Method</Label>
                      <Select
                        value={moduleConfig.missingValues.method}
                        onValueChange={(value) => updateModuleConfig("missingValues", "method", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mean">Mean Imputation</SelectItem>
                          <SelectItem value="median">Median Imputation</SelectItem>
                          <SelectItem value="knn">KNN Imputation</SelectItem>
                          <SelectItem value="multiple_imputation">Multiple Imputation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Missing Threshold: {moduleConfig.missingValues.threshold}</Label>
                      <Slider
                        value={[moduleConfig.missingValues.threshold]}
                        onValueChange={([value]) => updateModuleConfig("missingValues", "threshold", value)}
                        min={0.1}
                        max={0.9}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Outliers Config */}
              {activeModules.outliers && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Outlier Detection Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Detection Method</Label>
                      <Select
                        value={moduleConfig.outliers.method}
                        onValueChange={(value) => updateModuleConfig("outliers", "method", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="isolation_forest">Isolation Forest</SelectItem>
                          <SelectItem value="z_score">Z-Score</SelectItem>
                          <SelectItem value="iqr">Interquartile Range</SelectItem>
                          <SelectItem value="local_outlier_factor">Local Outlier Factor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Contamination Rate: {moduleConfig.outliers.contamination}</Label>
                      <Slider
                        value={[moduleConfig.outliers.contamination]}
                        onValueChange={([value]) => updateModuleConfig("outliers", "contamination", value)}
                        min={0.01}
                        max={0.3}
                        step={0.01}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Straight Liners Config */}
              {activeModules.straightLiners && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Straight-Liner Detection Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Consecutive Threshold</Label>
                      <Input
                        type="number"
                        value={moduleConfig.straightLiners.consecutiveThreshold}
                        onChange={(e) =>
                          updateModuleConfig("straightLiners", "consecutiveThreshold", Number.parseInt(e.target.value))
                        }
                        min={3}
                        max={20}
                      />
                    </div>
                    <div>
                      <Label>Variance Threshold: {moduleConfig.straightLiners.varianceThreshold}</Label>
                      <Slider
                        value={[moduleConfig.straightLiners.varianceThreshold]}
                        onValueChange={([value]) => updateModuleConfig("straightLiners", "varianceThreshold", value)}
                        min={0.01}
                        max={0.5}
                        step={0.01}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Speeders Config */}
              {activeModules.speeders && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Speeder Detection Settings</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Time (seconds)</Label>
                        <Input
                          type="number"
                          value={moduleConfig.speeders.minTimeSeconds}
                          onChange={(e) =>
                            updateModuleConfig("speeders", "minTimeSeconds", Number.parseInt(e.target.value))
                          }
                          min={10}
                        />
                      </div>
                      <div>
                        <Label>Max Time (seconds)</Label>
                        <Input
                          type="number"
                          value={moduleConfig.speeders.maxTimeSeconds}
                          onChange={(e) =>
                            updateModuleConfig("speeders", "maxTimeSeconds", Number.parseInt(e.target.value))
                          }
                          min={60}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Time Column</Label>
                      <Select
                        value={moduleConfig.speeders.timeColumn}
                        onValueChange={(value) => updateModuleConfig("speeders", "timeColumn", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {data.columns.map((col: string) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={runCleaning} disabled={!Object.values(activeModules).some(Boolean)}>
              <Play className="w-4 h-4 mr-2" />
              Run Cleaning Modules
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
