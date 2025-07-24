"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])

  useEffect(()=> {
    // can fetch alerts from http://localhost:3000/api/theft
    const fetchAlerts = async () => {
      const response = await fetch("http://localhost:3000/api/theft")
      const data = await response.json()
      setAlerts(data)
    }
    fetchAlerts()
  },[])

const handleClearAlerts = async () => {
  const response = await fetch("http://localhost:3000/api/theft", {
    method: "DELETE",
  })
  if (response.ok) {
    setAlerts([]) // Clear the alerts state after successful deletion
  }
}

  return (
    <SidebarInset className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Security Alerts</h1>
      </header>
      <div className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Theft Alerts
                </CardTitle>
                <CardDescription>Monitor security incidents and book theft alerts</CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleClearAlerts()} disabled={alerts.length === 0}>
                Clear All Alerts
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active alerts</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book ID</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Time Stolen</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.bookId}</TableCell>
                      <TableCell>{alert.book.title}</TableCell>
                      <TableCell>{alert.timeStolen.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Active Alert</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
