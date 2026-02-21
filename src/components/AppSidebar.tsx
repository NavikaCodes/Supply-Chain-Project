import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, PackagePlus, History, Settings, Factory, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Mint New Product", url: "/mint", icon: PackagePlus },
  { title: "Batch History", url: "/batch-history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [showSignup, setShowSignup] = useState(false);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empLocation, setEmpLocation] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  async function createEmployee() {

  if (!empName || !empEmail || !empPhone) {
    alert("Please fill all required fields");
    return;
  }

  const { error } = await supabase
    .from("employees")
    .insert([
{
  name: empName,
  email: empEmail,
  password: empPassword,
  phone: empPhone,
  location: empLocation,
  level: "Factory",
  can_scan: false
}
])

  if(error){
  console.log("SUPABASE ERROR:", error);
  alert(error.message);
} else {
  alert("Signup successful 🎉");

  setEmpName("");
  setEmpEmail("");
  setEmpPassword("");
  setEmpPhone("");
  setEmpLocation("");

  setShowSignup(false);
}
}
  return (
    <aside
      className={`flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-accent">
          <Factory className="w-4 h-4 text-sidebar-accent-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-primary">DPP Portal</span>
            <span className="text-[10px] text-sidebar-muted">Manufacturer</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
              activeClassName=""
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
      {/* Footer */}
{!collapsed && (
  <div className="px-4 py-4 border-t border-sidebar-border">
    <Button 
      className="w-full bg-green-600 hover:bg-green-700"
      onClick={() => setShowSignup(true)}
    >
      Signup 
    </Button>
  </div>
)}
<Dialog open={showSignup} onOpenChange={setShowSignup}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Signup</DialogTitle>
    </DialogHeader>

    <div className="space-y-3">

  <Input
    placeholder="Full Name"
    value={empName}
    onChange={(e) => setEmpName(e.target.value)}
  />

  <Input
    placeholder="Email"
    value={empEmail}
    onChange={(e) => setEmpEmail(e.target.value)}
  />
  <Input
  placeholder="Password"
  type="password"
  value={empPassword}
  onChange={(e) => setEmpPassword(e.target.value)}
 />

  <Input
    placeholder="Phone Number"
    value={empPhone}
    onChange={(e) => setEmpPhone(e.target.value)}
  />

  <Input
    placeholder="Location"
    value={empLocation}
    onChange={(e) => setEmpLocation(e.target.value)}
  />
  <Button
  className="w-full bg-green-600 hover:bg-green-700"
  onClick={createEmployee}
>
  Create Account
</Button>
  

</div>
  </DialogContent>
</Dialog>
 
    </aside>
  );
}
