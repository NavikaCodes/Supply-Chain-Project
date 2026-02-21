export interface Product {
  id: string;
  name: string;
  serialNumber: string;
  originCountry: string;
  material: string;
  factoryLocation: string;
  status: "minted" | "in-transit" | "received";
  mintedAt: string;
  txHash: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  product: string;
  timestamp: string;
  type: "mint" | "verify" | "receive" | "alert";
}

export interface DashboardMetrics {
  totalMinted: number;
  verifiedRate: number;
  activeAlerts: number;
}
