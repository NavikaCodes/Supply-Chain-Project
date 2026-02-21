import { Product, ActivityItem, DashboardMetrics } from "@/types/dpp";

const MOCK_PRODUCTS: Product[] = [
  { id: "DPP-001", name: "Organic Cotton T-Shirt", serialNumber: "SN-2024-00142", originCountry: "Portugal", material: "100% Organic Cotton", factoryLocation: "38.7223° N, 9.1393° W", status: "minted", mintedAt: "2024-12-15T10:30:00Z", txHash: "0x8a3f...e2d1" },
  { id: "DPP-002", name: "Recycled Denim Jacket", serialNumber: "SN-2024-00143", originCountry: "Italy", material: "80% Recycled Denim", factoryLocation: "45.4642° N, 9.1900° E", status: "in-transit", mintedAt: "2024-12-14T14:20:00Z", txHash: "0x1b2c...f4a7" },
  { id: "DPP-003", name: "Hemp Canvas Bag", serialNumber: "SN-2024-00144", originCountry: "France", material: "100% Industrial Hemp", factoryLocation: "48.8566° N, 2.3522° E", status: "received", mintedAt: "2024-12-13T09:15:00Z", txHash: "0x5d6e...c8b3" },
  { id: "DPP-004", name: "Bamboo Fiber Socks", serialNumber: "SN-2024-00145", originCountry: "Japan", material: "95% Bamboo Fiber", factoryLocation: "35.6762° N, 139.6503° E", status: "minted", mintedAt: "2024-12-12T16:45:00Z", txHash: "0x9f0a...d5e2" },
  { id: "DPP-005", name: "Merino Wool Sweater", serialNumber: "SN-2024-00146", originCountry: "New Zealand", material: "100% Merino Wool", factoryLocation: "41.2865° S, 174.7762° E", status: "in-transit", mintedAt: "2024-12-11T11:00:00Z", txHash: "0x3c4d...a1f6" },
  { id: "DPP-006", name: "Linen Blend Trousers", serialNumber: "SN-2024-00147", originCountry: "Belgium", material: "70% Linen, 30% Cotton", factoryLocation: "50.8503° N, 4.3517° E", status: "minted", mintedAt: "2024-12-10T08:30:00Z", txHash: "0x7e8f...b9c4" },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "1", action: "Product minted", product: "Organic Cotton T-Shirt", timestamp: "2 minutes ago", type: "mint" },
  { id: "2", action: "Shipment verified", product: "Recycled Denim Jacket", timestamp: "15 minutes ago", type: "verify" },
  { id: "3", action: "Retailer received", product: "Hemp Canvas Bag", timestamp: "1 hour ago", type: "receive" },
  { id: "4", action: "Product minted", product: "Bamboo Fiber Socks", timestamp: "3 hours ago", type: "mint" },
  { id: "5", action: "Supply chain alert", product: "Merino Wool Sweater", timestamp: "5 hours ago", type: "alert" },
];

const MOCK_METRICS: DashboardMetrics = {
  totalMinted: 1284,
  verifiedRate: 99.2,
  activeAlerts: 3,
};

export function getProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getActivity(): ActivityItem[] {
  return MOCK_ACTIVITY;
}

export function getMetrics(): DashboardMetrics {
  return MOCK_METRICS;
}

export async function mintProduct(data: Omit<Product, "id" | "status" | "mintedAt" | "txHash">): Promise<Product> {
  // Simulate blockchain transaction
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const txHash = "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "..." + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  const newProduct: Product = {
    ...data,
    id: `DPP-${String(MOCK_PRODUCTS.length + 1).padStart(3, "0")}`,
    status: "minted",
    mintedAt: new Date().toISOString(),
    txHash,
  };

  MOCK_PRODUCTS.unshift(newProduct);
  return newProduct;
}
