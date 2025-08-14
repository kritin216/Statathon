"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Settings, BarChart3, FileText, CheckCircle } from "lucide-react"
import { DataUploadStep } from "@/components/data-upload-step"
import { SchemaConfigStep } from "@/components/schema-config-step"
import { CleaningModulesStep } from "@/components/cleaning-modules-step"
import { WeightApplicationStep } from "@/components/weight-application-step"
import { VisualizationStep } from "@/components/visualization-step"
import { ReportGenerationStep } from "@/components/report-generation-step"

const steps = [
  { id: 1, title: "Data Upload", icon: Upload, description: "Upload your CSV or Excel file" },
  { id: 2, title: "Schema Configuration", icon: Settings, description: "Map and configure your data schema" },
  { id: 3, title: "Data Cleaning", icon: CheckCircle, description: "Apply cleaning modules to your data" },
  { id: 4, title: "Weight Application", icon: BarChart3, description: "Configure dynamic weights for analysis" },
  { id: 5, title: "Visualization", icon: BarChart3, description: "View data insights and visualizations" },
  { id: 6, title: "Report Generation", icon: FileText, description: "Generate comprehensive reports" },
]

export default function DataAnalysisApp() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedData, setUploadedData] = useState(null)
  const [schemaConfig, setSchemaConfig] = useState(null)
  const [cleaningConfig, setCleaningConfig] = useState(null)
  const [weightConfig, setWeightConfig] = useState(null)

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataUploadStep
            onDataUploaded={(data) => {
              setUploadedData(data)
              setCurrentStep(2)
            }}
          />
        )
      case 2:
        return (
          <SchemaConfigStep
            data={uploadedData}
            onConfigured={(config) => {
              setSchemaConfig(config)
              setCurrentStep(3)
            }}
            onBack={() => setCurrentStep(1)}
          />
        )
      case 3:
        return (
          <CleaningModulesStep
            data={uploadedData}
            schema={schemaConfig}
            onConfigured={(config) => {
              setCleaningConfig(config)
              setCurrentStep(4)
            }}
            onBack={() => setCurrentStep(2)}
          />
        )
      case 4:
        return (
          <WeightApplicationStep
            data={uploadedData}
            schema={schemaConfig}
            onConfigured={(config) => {
              setWeightConfig(config)
              setCurrentStep(5)
            }}
            onBack={() => setCurrentStep(3)}
          />
        )
      case 5:
        return (
          <VisualizationStep
            data={uploadedData}
            schema={schemaConfig}
            cleaning={cleaningConfig}
            weights={weightConfig}
            onNext={() => setCurrentStep(6)}
            onBack={() => setCurrentStep(4)}
          />
        )
      case 6:
        return (
          <ReportGenerationStep
            data={uploadedData}
            schema={schemaConfig}
            cleaning={cleaningConfig}
            weights={weightConfig}
            onBack={() => setCurrentStep(5)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">AI-Augmented Data Analysis Platform</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Clean, analyze, and generate insights from your survey data with AI assistance
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Progress</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center text-center ${
                      isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : isCurrent
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? "bg-green-100 dark:bg-green-900"
                          : isCurrent
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  )
}
