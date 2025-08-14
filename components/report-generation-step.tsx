"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  FileText,
  Download,
  Send,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Zap,
} from "lucide-react"

interface ReportGenerationStepProps {
  data: any
  schema: any
  cleaning: any
  weights: any
  onBack: () => void
}

export function ReportGenerationStep({ data, schema, cleaning, weights, onBack }: ReportGenerationStepProps) {
  const [reportConfig, setReportConfig] = useState({
    title: "Data Analysis Report",
    description: "Comprehensive analysis of survey data with cleaning and weighting applied",
    template: "comprehensive",
    format: "pdf",
    includeCharts: true,
    includeRawData: false,
    includeMethodology: true,
    apiKey: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState("")
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [reportPreview, setReportPreview] = useState("")

  const updateConfig = (field: string, value: any) => {
    setReportConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateReport = async () => {
    if (!reportConfig.apiKey) {
      alert("Please enter your API key to generate the report")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    const steps = [
      "Initializing report generation",
      "Processing data summary",
      "Analyzing cleaning results",
      "Calculating weighted metrics",
      "Generating visualizations",
      "Compiling methodology section",
      "Creating executive summary",
      "Finalizing report format",
    ]

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i])
      setGenerationProgress(((i + 1) / steps.length) * 100)

      // Simulate API processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    // Mock generated report data
    const mockReport = {
      id: `report_${Date.now()}`,
      title: reportConfig.title,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRecords: data.rows,
        processedRecords: cleaning?.results?.processedRows || data.rows - 98,
        qualityScore: 94,
        weightedColumns: Object.keys(weights.columnWeights).length,
        keyInsights: [
          "Data quality improved by 29% after cleaning process",
          `${Object.entries(weights.columnWeights).sort(([, a], [, b]) => b - a)[0]?.[0]} shows highest impact with ${Object.entries(
            weights.columnWeights,
          )
            .sort(([, a], [, b]) => b - a)[0]?.[1]
            ?.toFixed(1)}% weight`,
          "98 problematic records identified and removed",
          "Missing value imputation applied to 156 data points",
        ],
      },
      sections: {
        executiveSummary: true,
        methodology: reportConfig.includeMethodology,
        dataOverview: true,
        cleaningResults: true,
        weightingAnalysis: true,
        visualizations: reportConfig.includeCharts,
        recommendations: true,
        appendix: reportConfig.includeRawData,
      },
      downloadUrl: "#",
      previewUrl: "#",
    }

    setGeneratedReport(mockReport)
    setReportPreview(generatePreviewContent(mockReport))
    setIsGenerating(false)
  }

  const generatePreviewContent = (report: any) => {
    return `
# ${report.title}

**Generated:** ${new Date(report.generatedAt).toLocaleDateString()}
**Quality Score:** ${report.summary.qualityScore}%

## Executive Summary

This comprehensive analysis processed ${report.summary.totalRecords.toLocaleString()} survey responses, resulting in ${report.summary.processedRecords.toLocaleString()} high-quality records after applying advanced data cleaning techniques.

### Key Findings:
${report.summary.keyInsights.map((insight: string) => `• ${insight}`).join("\n")}

## Data Processing Overview

- **Original Records:** ${report.summary.totalRecords.toLocaleString()}
- **Final Records:** ${report.summary.processedRecords.toLocaleString()}
- **Removal Rate:** ${(((report.summary.totalRecords - report.summary.processedRecords) / report.summary.totalRecords) * 100).toFixed(1)}%
- **Quality Improvement:** 29%

## Methodology

### Data Cleaning Modules Applied:
${
  cleaning?.activeModules
    ? Object.entries(cleaning.activeModules)
        .filter(([_, active]) => active)
        .map(([module]) => `• ${module.charAt(0).toUpperCase() + module.slice(1).replace(/([A-Z])/g, " $1")}`)
        .join("\n")
    : "• Standard cleaning procedures applied"
}

### Weighting Strategy:
${
  weights.weightingStrategy === "ai_optimized"
    ? "• AI-optimized weighting based on predictive importance"
    : "• Manual weighting configuration applied"
}

## Recommendations

1. **Data Collection:** Implement validation rules to prevent future data quality issues
2. **Monitoring:** Establish ongoing quality monitoring for similar datasets
3. **Analysis:** Consider longitudinal analysis for trend identification
4. **Reporting:** Schedule regular automated reports for continuous insights

---
*Report generated using AI-Augmented Data Analysis Platform*
    `
  }

  if (generatedReport) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Report Generated Successfully
          </CardTitle>
          <CardDescription>Your comprehensive data analysis report is ready for download and sharing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {generatedReport.summary.totalRecords.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{generatedReport.summary.qualityScore}%</div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{generatedReport.summary.weightedColumns}</div>
                <div className="text-sm text-muted-foreground">Weighted Columns</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{reportConfig.format.toUpperCase()}</div>
                <div className="text-sm text-muted-foreground">Format</div>
              </div>
            </div>

            {/* Report Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(generatedReport.sections).map(([section, included]) => (
                    <div key={section} className="flex items-center justify-between">
                      <span className="capitalize">{section.replace(/([A-Z])/g, " $1")}</span>
                      <Badge variant={included ? "default" : "secondary"}>{included ? "Included" : "Excluded"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedReport.summary.keyInsights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Report Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{reportPreview}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Download Actions */}
            <div className="flex flex-wrap gap-4">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Data (CSV)
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Send className="w-4 h-4 mr-2" />
                Share Report
              </Button>
            </div>

            {/* Navigation */}
            <Separator />
            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Visualization
              </Button>
              <Button onClick={() => window.location.reload()}>Start New Analysis</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 animate-spin" />
            Generating Report
          </CardTitle>
          <CardDescription>Creating your comprehensive data analysis report using AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">{generationStep}</div>
              <Progress value={generationProgress} className="mb-4" />
              <div className="text-sm text-muted-foreground">{Math.round(generationProgress)}% complete</div>
            </div>

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Report generation typically takes 2-3 minutes. Please don't close this window while processing.
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
          <FileText className="w-5 h-5" />
          Report Generation
        </CardTitle>
        <CardDescription>
          Generate comprehensive reports with AI-powered insights, visualizations, and methodology documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Report Configuration</TabsTrigger>
              <TabsTrigger value="preview">Data Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6">
              {/* Basic Configuration */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    value={reportConfig.title}
                    onChange={(e) => updateConfig("title", e.target.value)}
                    placeholder="Enter report title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={reportConfig.description}
                    onChange={(e) => updateConfig("description", e.target.value)}
                    placeholder="Brief description of the analysis"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Report Template</Label>
                    <Select value={reportConfig.template} onValueChange={(value) => updateConfig("template", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive">Executive Summary</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                        <SelectItem value="technical">Technical Report</SelectItem>
                        <SelectItem value="presentation">Presentation Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Output Format</Label>
                    <Select value={reportConfig.format} onValueChange={(value) => updateConfig("format", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="html">HTML Report</SelectItem>
                        <SelectItem value="docx">Word Document</SelectItem>
                        <SelectItem value="pptx">PowerPoint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Content Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Visualizations</Label>
                      <p className="text-sm text-muted-foreground">Charts and graphs from analysis</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={reportConfig.includeCharts}
                      onChange={(e) => updateConfig("includeCharts", e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Methodology</Label>
                      <p className="text-sm text-muted-foreground">Detailed cleaning and weighting methods</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={reportConfig.includeMethodology}
                      onChange={(e) => updateConfig("includeMethodology", e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Raw Data</Label>
                      <p className="text-sm text-muted-foreground">Processed dataset as appendix</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={reportConfig.includeRawData}
                      onChange={(e) => updateConfig("includeRawData", e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Report Generation
                  </CardTitle>
                  <CardDescription>
                    Enter your API key to enable AI-powered report generation with advanced insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={reportConfig.apiKey}
                      onChange={(e) => updateConfig("apiKey", e.target.value)}
                      placeholder="Enter your API key for report generation"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your API key is used securely and not stored permanently
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              {/* Analysis Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{data.rows.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Original Records</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {cleaning?.results?.processedRows?.toLocaleString() || (data.rows - 98).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Clean Records</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(weights.columnWeights).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Weighted Columns</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">94%</div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                  </CardContent>
                </Card>
              </div>

              {/* Processing Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Data Upload & Configuration</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Data Cleaning Modules</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {cleaning?.activeModules ? Object.values(cleaning.activeModules).filter(Boolean).length : 0}{" "}
                        Applied
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Weight Application</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {weights.weightingStrategy === "ai_optimized" ? "AI Optimized" : "Manual"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Visualization Analysis</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Generated
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={generateReport} disabled={!reportConfig.apiKey || isGenerating} className="min-w-32">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>

          {!reportConfig.apiKey && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please enter your API key to enable AI-powered report generation with advanced insights and
                recommendations.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
