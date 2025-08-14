"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BarChart3, Download, Filter, Info } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie as RechartsPie,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
  Cell,
} from "recharts"

interface VisualizationStepProps {
  data: any
  schema: any
  cleaning: any
  weights: any
  onNext: () => void
  onBack: () => void
}

export function VisualizationStep({ data, schema, cleaning, weights, onNext, onBack }: VisualizationStepProps) {
  const [selectedChart, setSelectedChart] = useState("overview")
  const [selectedColumn, setSelectedColumn] = useState(schema?.responseColumns?.[0] || data.columns[0])
  const [showWeighted, setShowWeighted] = useState(true)

  // Mock visualization data based on the processed dataset
  const generateMockData = () => {
    const mockData = []
    const categories = ["Excellent", "Good", "Fair", "Poor"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    for (let i = 0; i < 6; i++) {
      mockData.push({
        month: months[i],
        responses: Math.floor(Math.random() * 200) + 100,
        satisfaction: Math.floor(Math.random() * 3) + 7,
        completion_rate: Math.floor(Math.random() * 20) + 75,
        weighted_score: Math.floor(Math.random() * 15) + 80,
      })
    }
    return mockData
  }

  const generateDistributionData = () => {
    return [
      { name: "Excellent", value: 45, color: "#22c55e" },
      { name: "Good", value: 32, color: "#3b82f6" },
      { name: "Fair", value: 18, color: "#f59e0b" },
      { name: "Poor", value: 5, color: "#ef4444" },
    ]
  }

  const generateCleaningImpactData = () => {
    return [
      { step: "Original", count: data.rows, quality: 65 },
      { step: "Deduplication", count: data.rows - 23, quality: 72 },
      { step: "Missing Values", count: data.rows - 23, quality: 78 },
      { step: "Outliers", count: data.rows - 35, quality: 85 },
      { step: "Straight-liners", count: data.rows - 53, quality: 89 },
      { step: "Speeders", count: data.rows - 98, quality: 94 },
    ]
  }

  const generateWeightImpactData = () => {
    const columns = schema?.responseColumns || data.columns.slice(0, 5)
    return columns.map((col: string) => ({
      column: col,
      original_importance: Math.random() * 30 + 10,
      weighted_importance: weights.columnWeights[col] || 20,
      impact_score: Math.random() * 40 + 60,
    }))
  }

  const mockTimeSeriesData = generateMockData()
  const distributionData = generateDistributionData()
  const cleaningImpactData = generateCleaningImpactData()
  const weightImpactData = generateWeightImpactData()

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  const renderOverviewCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Response Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Response Distribution</CardTitle>
          <CardDescription>Distribution of responses across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie
              data={distributionData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </RechartsPie>
            <Tooltip />
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trends Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Response Trends</CardTitle>
          <CardDescription>Monthly response patterns and satisfaction scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTimeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="responses" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="satisfaction" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Quality Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cleaning Impact</CardTitle>
          <CardDescription>How data cleaning improved quality scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cleaningImpactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="quality" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weight Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weight Impact</CardTitle>
          <CardDescription>Comparison of original vs weighted importance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weightImpactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="column" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="original_importance" fill="#94a3b8" name="Original" />
              <Bar dataKey="weighted_importance" fill="#3b82f6" name="Weighted" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderDetailedAnalysis = () => (
    <div className="space-y-6">
      {/* Column Selector */}
      <div className="flex items-center gap-4">
        <label className="font-medium">Analyze Column:</label>
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(schema?.responseColumns || data.columns).map((col: string) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline">Weight: {weights.columnWeights[selectedColumn]?.toFixed(1) || 0}%</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution Analysis</CardTitle>
            <CardDescription>Statistical distribution for {selectedColumn}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Correlation Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Correlation Matrix</CardTitle>
            <CardDescription>Relationships between variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {(schema?.responseColumns || data.columns.slice(0, 4)).map((col: string, i: number) => (
                <div key={col} className="space-y-2">
                  <div className="font-medium text-center">{col.slice(0, 8)}</div>
                  {(schema?.responseColumns || data.columns.slice(0, 4)).map((_, j: number) => {
                    const correlation = i === j ? 1 : Math.random() * 0.8 + 0.1
                    const intensity = Math.abs(correlation)
                    return (
                      <div
                        key={j}
                        className="h-8 flex items-center justify-center text-xs rounded"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                          color: intensity > 0.5 ? "white" : "black",
                        }}
                      >
                        {correlation.toFixed(2)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDataQualityMetrics = () => (
    <div className="space-y-6">
      {/* Quality Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-muted-foreground">Data Quality Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">98</div>
            <div className="text-sm text-muted-foreground">Records Removed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">156</div>
            <div className="text-sm text-muted-foreground">Values Imputed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">7</div>
            <div className="text-sm text-muted-foreground">Columns Processed</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Quality Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Breakdown</CardTitle>
          <CardDescription>Detailed analysis of data quality improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cleaning?.results?.moduleResults &&
              Object.entries(cleaning.results.moduleResults).map(([module, result]: [string, any]) => (
                <div key={module} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium capitalize">{module.replace(/([A-Z])/g, " $1")}</div>
                    <div className="text-sm text-muted-foreground">
                      {module === "deduplication" && `${result.duplicatesRemoved} duplicates removed`}
                      {module === "missingValues" && `${result.cellsImputed} values imputed`}
                      {module === "outliers" && `${result.outliersRemoved} outliers removed`}
                      {module === "straightLiners" && `${result.straightLinersRemoved} straight-liners removed`}
                      {module === "speeders" && `${result.speedersRemoved} speeders removed`}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Completed
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Data Visualization Dashboard
        </CardTitle>
        <CardDescription>
          Explore your cleaned and weighted data through interactive visualizations and insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {cleaning?.results?.processedRows?.toLocaleString() || data.rows.toLocaleString()} Records
              </Badge>
              <Badge variant="outline">{Object.keys(weights.columnWeights).length} Weighted Columns</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                94% Quality Score
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Visualization Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="quality">Data Quality</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {renderOverviewCharts()}
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              {renderDetailedAnalysis()}
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              {renderDataQualityMetrics()}
            </TabsContent>
          </Tabs>

          {/* Key Insights */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Key Insights:</strong> Data quality improved by 29% after cleaning. Weighted analysis shows{" "}
              {Object.entries(weights.columnWeights).sort(([, a], [, b]) => b - a)[0]?.[0]}
              has the highest impact (
              {Object.entries(weights.columnWeights)
                .sort(([, a], [, b]) => b - a)[0]?.[1]
                ?.toFixed(1)}
              % weight).
              {cleaning?.results?.removedRows || 98} problematic records were identified and removed.
            </AlertDescription>
          </Alert>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={onNext}>Generate Report</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
