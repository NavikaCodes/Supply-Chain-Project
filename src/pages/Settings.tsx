import { Settings as SettingsIcon } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your portal configuration</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-3">
        <div className="p-3 rounded-full bg-secondary">
          <SettingsIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-sm font-medium text-foreground">Settings Coming Soon</h2>
        <p className="text-xs text-muted-foreground max-w-xs">
          Wallet connection, organization settings, and API key management will be available here.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
