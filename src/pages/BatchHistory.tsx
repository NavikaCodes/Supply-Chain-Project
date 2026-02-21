import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Camera, QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QrScanner } from '@/components/QrScanner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BatchHistory = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [canScan, setCanScan] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showNotEnabled, setShowNotEnabled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchTracking();
    checkPermission();
  }, []);

  async function checkPermission() {
    const employeeId = "550e8400-e29b-41d4-a716-446655440000"; 
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", employeeId)
      .single();

    console.log("EMPLOYEE:", data);
    setCanScan(data?.can_scan || false);
  }

  async function fetchTracking() {
    const { data, error } = await supabase
      .from("Product_tracking")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (data) {
      setTrackingData(data);
    }
  }

  const handleVerificationClick = (item: any) => {
    if (canScan) {
      setSelectedProduct(item);
      setShowScanner(true);
    } else {
      setShowNotEnabled(true);
    }
  };

  const handleScanSuccess = (scannedData: string) => {
    setShowScanner(false);
    alert(`Product scanned: ${scannedData}`);

  };
  const filteredData = trackingData.filter(item =>
  item.product_id?.toString().includes(search) ||
  item.holder_name?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Batch History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All manufactured items and their supply chain status
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, serial, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Holder Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Blockchain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{item.product_id}</TableCell>
                <TableCell>{item.holder_name}</TableCell>
                <TableCell>{item.holder_type}</TableCell>
                <TableCell>{item.location}</TableCell>
                
                <TableCell>
                  <Button
                    onClick={() => handleVerificationClick(item)}
                    className={canScan 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }
                    size="sm"
                  >
                    {canScan ? (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Scan
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 mr-2" />
                        Pending
                      </>
                    )}
                  </Button>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="text-blue-600">
                    Blockchain ✓
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <QrScanner
              onScanSuccess={handleScanSuccess}
              onScanError={(error) => {
                alert('Scan error: ' + error.message);
                setShowScanner(false);
              }}
            />
            <p className="text-sm text-muted-foreground text-center mt-4">
              Place QR code in front of camera
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotEnabled} onOpenChange={setShowNotEnabled}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 text-center">
              Scan Not Enabled
            </DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <X className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-gray-600 mb-2">
              You don't have permission to scan this product yet.
            </p>
            <p className="text-sm text-gray-500">
              Please wait for admin approval. You'll be able to scan once the admin enables it.
            </p>
          </div>
          <div className="flex justify-center pb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowNotEnabled(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchHistory; 