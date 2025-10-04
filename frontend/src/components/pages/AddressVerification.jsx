import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Shield, Search, MapPin, Check, X, RefreshCw, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

// Mock API function
const verifyAddressAPI = (address) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomScore = Math.random();
      let status;
      if (randomScore > 0.8) status = "Verified";
      else if (randomScore > 0.4) status = "Suspicious";
      else status = "Rejected";

      resolve({
        address,
        confidence: randomScore,
        status: status,
        breakdown: [
          { source: 'Google Maps API', match: randomScore > 0.3 },
          { source: 'National Postal Service', match: randomScore > 0.5 },
          { source: 'Public Records Database', match: randomScore > 0.7 },
        ],
      });
    }, 1500);
  });
};

const AddressVerification = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!address) {
      toast.error("Please enter an address to verify.");
      return;
    }
    setLoading(true);
    setResult(null);
    const data = await verifyAddressAPI(address);
    setResult(data);
    setLoading(false);
    toast.success("Verification complete!");
  };

  const getConfidenceColor = (score) => {
    if (score > 0.8) return "text-green-500";
    if (score > 0.4) return "text-amber-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score) => {
    if (score > 0.8) return "[&>*]:bg-green-500";
    if (score > 0.4) return "[&>*]:bg-amber-500";
    return "[&>*]:bg-red-500";
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Single Address Verification</h1>
            <p className="text-muted-foreground">Verify a single address using our multi-source engine.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Search className="mr-2 h-5 w-5" />Verification Input</CardTitle>
                    <CardDescription>Enter the address you want to check.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input 
                            id="address" 
                            placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleVerify} disabled={loading} className="w-full">
                        {loading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Shield className="mr-2 h-4 w-4" />
                        )}
                        {loading ? 'Verifying...' : 'Verify Address'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" />Verification Result</CardTitle>
                    <CardDescription>Detailed analysis from our data sources.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                    {!result && !loading && (
                        <div className="text-center text-muted-foreground">
                            <MapPin className="mx-auto h-12 w-12" />
                            <p className="mt-2">Results will be displayed here.</p>
                        </div>
                    )}
                    {loading && (
                         <div className="text-center text-primary">
                            <RefreshCw className="mx-auto h-12 w-12 animate-spin" />
                            <p className="mt-2 font-semibold">Analyzing...</p>
                        </div>
                    )}
                    {result && (
                        <div className="w-full space-y-6">
                            <div className="text-center border rounded-lg p-6">
                                <h3 className="text-sm font-medium text-muted-foreground">Confidence Score</h3>
                                <p className={`text-6xl font-bold ${getConfidenceColor(result.confidence)}`}>
                                    {(result.confidence * 100).toFixed(0)}%
                                </p>
                                <Progress value={result.confidence * 100} className={`h-2 mt-2 ${getProgressColor(result.confidence)}`} />
                                <p className="mt-2 text-lg font-semibold">{result.status}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Score Breakdown</h4>
                                <div className="space-y-2">
                                    {result.breakdown.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 rounded-md bg-secondary">
                                            <p className="text-sm font-medium">{item.source}</p>
                                            {item.match ? (
                                                <div className="flex items-center text-green-600">
                                                    <Check className="h-4 w-4 mr-1" />
                                                    <span className="text-sm">Match</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-600">
                                                    <X className="h-4 w-4 mr-1" />
                                                    <span className="text-sm">Mismatch</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default AddressVerification;