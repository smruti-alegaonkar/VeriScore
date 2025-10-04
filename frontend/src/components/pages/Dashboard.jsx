import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { FileText, CheckCircle, AlertTriangle, XCircle, Clock, BarChart3, RefreshCw } from "lucide-react";

// Mock API function
const fetchDashboardStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total_verifications: 1489,
        verified_count: 1280,
        suspicious_count: 153,
        rejected_count: 56,
        verification_rate: 86.0,
        recent_verifications: [
          { id: 1, address: "1 Hacker Way, Menlo Park, CA", status: "verified", confidence: 0.95 },
          { id: 2, address: "88 Colin P Kelly Jr St, San Francisco, CA", status: "verified", confidence: 0.92 },
          { id: 3, address: "123 Fake Street, Nowhere, NY", status: "rejected", confidence: 0.15 },
          { id: 4, address: "404 Not Found Blvd, Internet City, USA", status: "suspicious", confidence: 0.45 },
          { id: 5, address: "1 Infinite Loop, Cupertino, CA", status: "verified", confidence: 0.99 },
        ],
      });
    }, 1000); // 1-second delay
  });
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const data = await fetchDashboardStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "verified": return "default";
      case "suspicious": return "secondary";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const getProgressColor = (confidence) => {
    if (confidence > 0.8) return "bg-green-500";
    if (confidence > 0.5) return "bg-amber-500";
    return "bg-red-500";
  }

  const statCards = [
    { title: "Total Verifications", value: stats?.total_verifications, icon: FileText, color: "text-blue-500" },
    { title: "Verified", value: stats?.verified_count, icon: CheckCircle, color: "text-green-500" },
    { title: "Suspicious", value: stats?.suspicious_count, icon: AlertTriangle, color: "text-amber-500" },
    { title: "Rejected", value: stats?.rejected_count, icon: XCircle, color: "text-red-500" },
  ];

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor address verification status and compliance alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value || 0}</div>
                  {card.title === "Verified" && (
                    <p className="text-xs text-muted-foreground">
                      {stats?.verification_rate.toFixed(1)}% success rate
                    </p>
                  )}
                </CardContent>
              </Card>
            );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recent_verifications?.map((v) => (
              <div key={v.id} className="grid grid-cols-3 items-center gap-4 p-2 rounded-md hover:bg-accent">
                <p className="font-medium truncate col-span-1">{v.address}</p>
                <div className="flex items-center gap-2 col-span-1">
                  <Progress value={v.confidence * 100} className="h-2 w-full [&>*]:bg-primary"/>
                  <span className="text-sm font-semibold w-12 text-right">{(v.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-end col-span-1">
                    <Badge variant={getStatusBadgeVariant(v.status)} className="capitalize w-20 justify-center">{v.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;