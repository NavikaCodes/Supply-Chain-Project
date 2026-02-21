import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types/dpp";
import { CheckCircle, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

interface MintSuccessModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function MintSuccessModal({ product, open, onClose }: MintSuccessModalProps) {
  const [showPassport, setShowPassport] = useState(false);
  const { toast } = useToast();

  // Animate from "verifying" to "success" after mount
  useState(() => {
    const timer = setTimeout(() => setShowPassport(true), 1500);
    return () => clearTimeout(timer);
  });

  const polygonscanUrl = `https://polygonscan.com/tx/${product.txHash}`;

  const copyTxHash = () => {
    navigator.clipboard.writeText(product.txHash);
    toast({ title: "Copied!", description: "Transaction hash copied to clipboard." });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Minting Result</DialogTitle>
        {!showPassport ? (
          <div className="flex flex-col items-center py-10 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
            <p className="text-sm font-medium text-foreground">Verifying on Blockchain...</p>
            <p className="text-xs text-muted-foreground">Confirming transaction on Polygon Network</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 space-y-5 animate-scale-in">
            {/* Success icon */}
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div className="absolute inset-0 rounded-full bg-success/20 animate-pulse-ring" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">Digital Passport Created</h3>
              <p className="text-xs text-muted-foreground mt-1">Successfully minted on Polygon</p>
            </div>

            {/* Passport Preview */}
            <div className="w-full border border-border rounded-lg p-5 space-y-4 bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.id}</p>
                </div>
                <QRCodeSVG
                  value={polygonscanUrl}
                  size={64}
                  bgColor="transparent"
                  fgColor="hsl(216, 55%, 23%)"
                  level="M"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Serial</p>
                  <p className="font-medium text-foreground">{product.serialNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Origin</p>
                  <p className="font-medium text-foreground">{product.originCountry}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Material</p>
                  <p className="font-medium text-foreground">{product.material}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-success">✓ Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <code className="text-[10px] text-muted-foreground flex-1 truncate">{product.txHash}</code>
                <button onClick={copyTxHash} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={polygonscanUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  View on Polygonscan
                </a>
              </Button>
              <Button size="sm" className="flex-1" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
