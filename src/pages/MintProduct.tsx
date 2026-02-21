import { useState } from "react";
import { mintProduct } from "@/services/mockBlockchain";
import { Product } from "@/types/dpp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Hexagon } from "lucide-react";
import { MintSuccessModal } from "@/components/MintSuccessModal";

const MintProduct = () => {
  const [loading, setLoading] = useState(false);
  const [mintedProduct, setMintedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    serialNumber: "",
    originCountry: "",
    material: "",
    factoryLocation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const product = await mintProduct(form);
      setMintedProduct(product);
      setForm({ name: "", serialNumber: "", originCountry: "", material: "", factoryLocation: "" });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mint New Product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Register a new product and create its Digital Product Passport on-chain
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g. Organic Cotton T-Shirt"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serial">Serial Number</Label>
            <Input
              id="serial"
              placeholder="e.g. SN-2024-00148"
              value={form.serialNumber}
              onChange={(e) => updateField("serialNumber", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="country">Origin Country</Label>
            <Select
              value={form.originCountry}
              onValueChange={(v) => updateField("originCountry", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {["Portugal", "Italy", "France", "Japan", "New Zealand", "Belgium", "Germany", "Spain"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Material Composition</Label>
            <Input
              id="material"
              placeholder="e.g. 100% Organic Cotton"
              value={form.material}
              onChange={(e) => updateField("material", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="factory">Factory Location (GPS)</Label>
          <Input
            id="factory"
            placeholder="e.g. 38.7223° N, 9.1393° W"
            value={form.factoryLocation}
            onChange={(e) => updateField("factoryLocation", e.target.value)}
            required
          />
        </div>

        {/* Upload Evidence */}
        <div className="space-y-2">
          <Label>Upload Evidence</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag & drop lab certificates or factory photos
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-medium"
          disabled={loading || !form.name || !form.serialNumber || !form.originCountry || !form.material || !form.factoryLocation}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Minting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Hexagon className="w-4 h-4" />
              Mint to Polygon Network
            </span>
          )}
        </Button>
      </form>

      {mintedProduct && (
        <MintSuccessModal
          product={mintedProduct}
          open={!!mintedProduct}
          onClose={() => setMintedProduct(null)}
        />
      )}
    </div>
  );
};

export default MintProduct;
