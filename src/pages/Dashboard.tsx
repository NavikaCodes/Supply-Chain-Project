import { getMetrics, getActivity } from "@/services/mockBlockchain";
import { Truck, Shield, Factory, CheckCircle, AlertTriangle, Package } from "lucide-react";

const metrics = getMetrics();
const activity = getActivity();

const activityIcons = {
  mint: CheckCircle,
  verify: Shield,
  receive: Package,
  alert: AlertTriangle,
};

const activityColors = {
  mint: "text-success",
  verify: "text-info",
  receive: "text-primary",
  alert: "text-warning",
};

const Dashboard = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your Digital Product Passport activity
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          icon={Factory}
          label="Total Units Minted"
          value={metrics.totalMinted.toLocaleString()}
          change="+12 this week"
          changePositive
        />
        <MetricCard
          icon={Shield}
          label="Verified Authentic Rate"
          value={`${metrics.verifiedRate}%`}
          change="+0.3% from last month"
          changePositive
        />
        <MetricCard
          icon={Truck}
          label="Active Supply Chain Alerts"
          value={String(metrics.activeAlerts)}
          change="2 resolved today"
          changePositive={false}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {activity.map((item) => {
            const Icon = activityIcons[item.type];
            return (
              <div key={item.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className={`${activityColors[item.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.product}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  changePositive,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="p-2 rounded-md bg-secondary">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <p className="text-3xl font-semibold text-foreground tracking-tight">{value}</p>
      <p className={`text-xs ${changePositive ? "text-success" : "text-warning"}`}>{change}</p>
    </div>
  );
}

export default Dashboard;
