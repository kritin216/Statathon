"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"

interface DataUploadStepProps {
  onDataUploaded: (data: any) => void
}

export function DataUploadStep({ onDataUploaded }: DataUploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      processFile(file)
    } else {
      setError("Please upload a CSV or Excel file")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setUploadedFile(file)

    try {
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock data structure - in real app, this would parse the actual file
      const mockData = {
        fileName: file.name,
        fileSize: file.size,
        rows: 1250,
        columns: ["id", "name", "email", "age", "satisfaction_score", "completion_time", "response_date"],
        preview: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            age: 32,
            satisfaction_score: 8,
            completion_time: 245,
            response_date: "2024-01-15",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            age: 28,
            satisfaction_score: 9,
            completion_time: 180,
            response_date: "2024-01-15",
          },
          {
            id: 3,
            name: "Bob Johnson",
            email: "bob@example.com",
            age: 45,
            satisfaction_score: 7,
            completion_time: 320,
            response_date: "2024-01-16",
          },
        ],
      }

      onDataUploaded(mockData)
    } catch (err) {
      setError("Failed to process file. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (uploadedFile && !isProcessing && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            File Uploaded Successfully
          </CardTitle>
          <CardDescription>Your data has been processed and is ready for configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • 1,250 rows • 7 columns
                </p>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Data preview shows 3 sample rows. Click "Continue" to proceed with schema configuration.
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
        <CardTitle>Upload Your Data</CardTitle>
        <CardDescription>
          Upload a CSV or Excel file containing your survey data. Supported formats: .csv, .xlsx, .xls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">
              {isDragOver ? "Drop your file here" : "Drag and drop your file here"}
            </h3>
            <p className="text-muted-foreground mb-4">or click below to browse and select a file</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="sr-only">
                  Choose file
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById("file-upload")?.click()}
                  disabled={isProcessing}
                  variant="outline"
                >
                  {isProcessing ? "Processing..." : "Choose File"}
                </Button>
              </div>
            </div>
          </div>

          {/* File Requirements */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">File Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Maximum file size: 50MB</li>
              <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
              <li>• First row should contain column headers</li>
              <li>• Ensure data is properly formatted with no merged cells</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
