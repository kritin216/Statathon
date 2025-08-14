"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Database } from "lucide-react"

interface SchemaConfigStepProps {
  data: any
  onConfigured: (config: any) => void
  onBack: () => void
}

const dataTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Boolean" },
  { value: "categorical", label: "Categorical" },
  { value: "likert", label: "Likert Scale" },
  { value: "time", label: "Time Duration" },
]

const roles = [
  { value: "identifier", label: "Identifier" },
  { value: "demographic", label: "Demographic" },
  { value: "response", label: "Survey Response" },
  { value: "metadata", label: "Metadata" },
  { value: "weight", label: "Weight Variable" },
  { value: "exclude", label: "Exclude from Analysis" },
]

export function SchemaConfigStep({ data, onConfigured, onBack }: SchemaConfigStepProps) {
  const [columnConfig, setColumnConfig] = useState(() => {
    // Initialize with smart defaults based on column names
    const config: Record<string, { type: string; role: string }> = {}

    data.columns.forEach((col: string) => {
      const lowerCol = col.toLowerCase()

      // Smart type detection
      let type = "text"
      if (lowerCol.includes("age") || lowerCol.includes("score") || lowerCol.includes("time")) {
        type = "number"
      } else if (lowerCol.includes("date")) {
        type = "date"
      } else if (lowerCol.includes("satisfaction") || lowerCol.includes("rating")) {
        type = "likert"
      }

      // Smart role detection
      let role = "response"
      if (lowerCol === "id" || lowerCol.includes("identifier")) {
        role = "identifier"
      } else if (lowerCol.includes("age") || lowerCol.includes("gender") || lowerCol.includes("location")) {
        role = "demographic"
      } else if (lowerCol.includes("date") || lowerCol.includes("time")) {
        role = "metadata"
      }

      config[col] = { type, role }
    })

    return config
  })

  const updateColumnConfig = (column: string, field: "type" | "role", value: string) => {
    setColumnConfig((prev) => ({
      ...prev,
      [column]: {
        ...prev[column],
        [field]: value,
      },
    }))
  }

  const handleContinue = () => {
    const config = {
      columns: columnConfig,
      totalColumns: data.columns.length,
      identifierColumns: Object.entries(columnConfig)
        .filter(([_, config]) => config.role === "identifier")
        .map(([col]) => col),
      responseColumns: Object.entries(columnConfig)
        .filter(([_, config]) => config.role === "response")
        .map(([col]) => col),
      demographicColumns: Object.entries(columnConfig)
        .filter(([_, config]) => config.role === "demographic")
        .map(([col]) => col),
    }

    onConfigured(config)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "identifier":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "demographic":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "response":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "metadata":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "weight":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "exclude":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Schema Configuration
        </CardTitle>
        <CardDescription>
          Configure data types and roles for each column. AI has pre-configured smart defaults based on your column
          names.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Dataset Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">File:</span>
                <p className="font-medium">{data.fileName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Rows:</span>
                <p className="font-medium">{data.rows.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Columns:</span>
                <p className="font-medium">{data.columns.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Size:</span>
                <p className="font-medium">{(data.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>

          {/* Column Configuration Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column Name</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sample Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.columns.map((column: string, index: number) => (
                  <TableRow key={column}>
                    <TableCell className="font-medium">{column}</TableCell>
                    <TableCell>
                      <Select
                        value={columnConfig[column]?.type || "text"}
                        onValueChange={(value) => updateColumnConfig(column, "type", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dataTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={columnConfig[column]?.role || "response"}
                        onValueChange={(value) => updateColumnConfig(column, "role", value)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {data.preview[0] && data.preview[0][column] ? String(data.preview[0][column]) : "N/A"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Role Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-3">Configuration Summary</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                Object.entries(columnConfig).reduce(
                  (acc, [col, config]) => {
                    acc[config.role] = (acc[config.role] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>,
                ),
              ).map(([role, count]) => (
                <Badge key={role} className={getRoleBadgeColor(role)}>
                  {roles.find((r) => r.value === role)?.label || role}: {count}
                </Badge>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleContinue}>Continue to Data Cleaning</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
