import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Camera, QrCode, X, User } from 'lucide-react';
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
  const [search, setSearch] = useState("");
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [canScan, setCanScan] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showNotEnabled, setShowNotEnabled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: employee, error } = await supabase
          .from("employees")
          .select("*")
          .eq("email", session.user.email)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching employee:", error);
        } else {
          setCurrentUser(employee);
          setCanScan(employee?.can_scan || false);
          
          if (employee) {
            await fetchUserBatches(employee.id);
          }
        }
      } else {
        setCurrentUser(null);
        setCanScan(false);
        setTrackingData([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setLoading(false);
    }
  }

  async function fetchUserBatches(userId: string) {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("Product_tracking")
        .select("*")
        .eq("holder_id", userId);

      if (error) {
        console.error("Error fetching user batches:", error);
      } else {
        setTrackingData(data || []);
      }
    } catch (error) {
      console.error("Error in fetchUserBatches:", error);
    } finally {
      setLoading(false);
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

  const handleScanSuccess = async (scannedData: string) => {
    setShowScanner(false);
    alert(`Product scanned: ${scannedData}`);

    if (selectedProduct && currentUser) {
      const { error } = await supabase
        .from("Product_tracking")
        .update({ 
          verified_by: currentUser.id,
          verified_at: new Date().toISOString(),
          status: 'verified'
        })
        .eq('product_id', selectedProduct.product_id);

      if (!error) {
        await fetchUserBatches(currentUser.id);
      }
    }
  };

  const filteredData = trackingData.filter(item =>
    item.product_id?.toString().includes(search) ||
    item.holder_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            My Allotted Batches
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentUser ? (
              <>Showing batches allotted to: <span className="font-medium text-foreground">{currentUser.name}</span></>
            ) : (
              "Please login to view your allotted batches"
            )}
          </p>
        </div>
        {currentUser && (
          <Badge variant="outline" className="px-3 py-1">
            <User className="w-3 h-3 mr-1" />
            {currentUser.name || currentUser.email}
          </Badge>
        )}
      </div>

      {currentUser ? (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your batches..."
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item: any, index: number) => (
                    <TableRow key={item.id || index}>
                      <TableCell className="font-mono text-xs">{item.product_id}</TableCell>
                      <TableCell>{item.holder_name}</TableCell>
                      <TableCell>{item.holder_type}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleVerificationClick(item)}
                          className={canScan 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-gray-300 hover:bg-gray-400 text-gray-700 cursor-not-allowed'
                          }
                          size="sm"
                          disabled={!canScan}
                        >
                          {canScan ? (
                            <>
                              <Camera className="w-4 h-4 mr-2" />
                              Scan
                            </>
                          ) : (
                            <>
                              <QrCode className="w-4 h-4 mr-2" />
                              Pending Approval
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No batches allotted to you yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Not Logged In</h3>
          <p className="text-muted-foreground mb-4">
            Please login to view your allotted batches
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Login
          </Button>
        </div>
      )}

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
              You don't have permission to scan products yet.
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