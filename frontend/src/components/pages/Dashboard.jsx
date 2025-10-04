// import React, { useState, useEffect, useContext } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Badge } from "../ui/badge";
// import { Progress } from "../ui/progress";
// import { FileText, CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw } from "lucide-react";
// import { VerificationContext } from '../../contexts/VerificationContext'; // Ensure path is correct

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Get the real-time list of verifications from the shared context
//   // This will update automatically when you verify a new address
//   const { verifications } = useContext(VerificationContext);

//   const loadStats = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/dashboard-stats');
//       if (!response.ok) throw new Error('Failed to fetch stats');
//       const data = await response.json();
//       setStats(data);
//     } catch (error) {
//       console.error("Dashboard fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadStats();
//   }, [verifications]); // <-- The magic: Re-fetch stats every time a new verification is added

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "verified": return "default";
//       case "suspicious": return "secondary";
//       case "rejected": return "destructive";
//       default: return "outline";
//     }
//   };
  
//   const statCards = [
//     { title: "Total Verifications", value: stats?.total_verifications, icon: FileText, color: "text-blue-500" },
//     { title: "Verified", value: stats?.verified_count, icon: CheckCircle, color: "text-green-500" },
//     { title: "Suspicious", value: stats?.suspicious_count, icon: AlertTriangle, color: "text-amber-500" },
//     { title: "Rejected", value: stats?.rejected_count, icon: XCircle, color: "text-red-500" },
//   ];

//   if (loading && !stats) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <RefreshCw className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
//         <p className="text-muted-foreground">Monitor address verification status and compliance alerts.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {statCards.map((card, index) => {
//               const Icon = card.icon;
//               return (
//                 <Card key={index}>
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
//                     <Icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">{card.value || 0}</div>
//                     {card.title === "Verified" && stats?.total_verifications > 0 && (
//                       <p className="text-xs text-muted-foreground">
//                         {stats?.verification_rate.toFixed(1)}% success rate
//                       </p>
//                     )}
//                   </CardContent>
//                 </Card>
//               );
//           })}
//       </div>
      
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Clock className="h-5 w-5 mr-2" />
//             Recent Verifications
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {stats?.recent_verifications && stats.recent_verifications.length > 0 ? (
//               stats.recent_verifications.map((v) => (
//                 <div key={v.id} className="grid grid-cols-3 items-center gap-4 p-2 rounded-md hover:bg-accent">
//                   <p className="font-medium truncate col-span-1">{v.address}</p>
//                   <div className="flex items-center gap-2 col-span-1">
//                     <Progress value={v.confidence * 100} className="h-2 w-full [&>*]:bg-primary"/>
//                     <span className="text-sm font-semibold w-12 text-right">{(v.confidence * 100).toFixed(0)}%</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-muted-foreground text-center py-4">No verifications yet. Go to the "Verify Address" page to start.</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { FileText, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";
import { VerificationContext } from '../../contexts/VerificationContext'; // Ensure path is correct
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { verifications } = useContext(VerificationContext);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/dashboard-stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [verifications]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "verified":
        return "default";
      case "suspicious":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const statCards = [
    { title: "Total Verifications", value: stats?.total_verifications, icon: FileText, color: "bg-blue-100 text-blue-700" },
    { title: "Verified", value: stats?.verified_count, icon: CheckCircle, color: "bg-green-100 text-green-700" },
    { title: "Suspicious", value: stats?.suspicious_count, icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
    { title: "Rejected", value: stats?.rejected_count, icon: XCircle, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-8 p-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Compliance Dashboard</h1>
        <p className="text-muted-foreground text-base mb-4">Monitor address verification status and compliance alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(loading ? Array(4).fill({}) : statCards).map((card, index) => {
          const Icon = card.icon ? card.icon : Skeleton;
          return (
            <Card className="rounded-xl shadow-lg border hover:scale-105 transition" key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{loading ? <Skeleton width={80} /> : card.title}</CardTitle>
                <span className={`rounded-full p-2 ${card.color}`}>
                  {loading ? <Skeleton circle width={24} height={24} /> : <Icon className="h-5 w-5" />}
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? <Skeleton width={36} /> : (card.value ?? 0)}</div>
                {card.title === "Verified" && stats?.total_verifications > 0 && !loading && (
                  <p className="text-xs text-muted-foreground">{stats.verification_rate?.toFixed(1)}% success rate</p>
                )}
                {loading && <Skeleton width={60} height={10} style={{ marginTop: 6 }} />}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-xl shadow-md min-h-[220px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array(4).fill().map((_, idx) => (
                <div key={idx} className="grid grid-cols-3 items-center gap-4 rounded-md py-2 px-1">
                  <Skeleton width={`70%`} />
                  <Skeleton width={`95%`} />
                  <Skeleton width={56} />
                </div>
              ))
            ) : stats?.recent_verifications && stats.recent_verifications.length > 0 ? (
              stats.recent_verifications.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-3 items-center gap-4 p-2 rounded-md hover:shadow hover:bg-accent/30 transition"
                >
                  <p className="font-medium truncate">{v.address}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={v.confidence * 100} className="h-2 w-full rounded bg-muted" />
                    <span
                      title="Confidence (AI score)"
                      className="text-sm font-semibold w-12 text-right"
                    >
                      {(v.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Badge variant={getStatusBadgeVariant(v.status)}>
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-7">
                No verifications yet. <br />
                Go to the "Verify Address" page to start.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
