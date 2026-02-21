import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PackagePlus, History, Settings, Factory, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Mint New Product", url: "/mint", icon: PackagePlus },
  { title: "Batch History", url: "/batch-history", icon: History },
];

export function AppSidebar() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // User state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Signup form state
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empLocation, setEmpLocation] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchEmployeeData(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchEmployeeData(session.user);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEmployeeData(authUser: any) {
    const { data: employee } = await supabase
      .from("employees")
      .select("*")
      .eq("email", authUser.email)
      .maybeSingle();

    setUser({
      ...authUser,
      employeeData: employee || null
    });
  }

  async function login() {
    setLoginError("");
    setIsLoggingIn(true);

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill all fields");
      setIsLoggingIn(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError(error.message);
      setIsLoggingIn(false);
      return;
    }

    if (data.user) {
      await fetchEmployeeData(data.user);
      setShowLogin(false);
      setLoginEmail("");
      setLoginPassword("");
      navigate("/");
    }

    setIsLoggingIn(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  }

  async function createEmployee() {
    if (!empName || !empEmail || !empPhone || !empPassword) {
      alert("Please fill all required fields");
      return;
    }

    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: empEmail,
      password: empPassword,
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    if (authData.user) {
      // Then create employee record with role column
      const { error } = await supabase
        .from("employees")
        .insert([
          {
            id: authData.user.id, // Link to auth user
            name: empName,
            email: empEmail,
            phone: empPhone,
            location: empLocation,
            level: "Factory",
            role: "Factory", // Adding role column here
            can_scan: false
          }
        ]);

      if (error) {
        console.log("SUPABASE ERROR:", error);
        alert(error.message);
      } else {
        alert("Signup successful! 🎉 You can now login.");
        
        // Clear form
        setEmpName("");
        setEmpEmail("");
        setEmpPassword("");
        setEmpPhone("");
        setEmpLocation("");
        
        setShowSignup(false);
        setShowLogin(true); // Open login dialog
      }
    }
  }

  if (loading) {
    return (
      <aside className={`flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sidebar-primary" />
        </div>
      </aside>
    );
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
            <span className="text-sm font-semibold text-sidebar-primary">Employee</span>
            <span className="text-[10px] text-sidebar-muted"></span>
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

      {/* User Info & Auth Buttons */}
      <div className="px-4 py-4 border-t border-sidebar-border space-y-2">
        {user ? (
          <>
            {/* User Info */}
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent/30 mb-2">
                <User className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {user.employeeData?.name || user.email}
                  </p>
                  <p className="text-[10px] text-sidebar-muted">
                    {user.employeeData?.role || user.employeeData?.level || "Employee"}
                  </p>
                </div>
                {user.employeeData?.can_scan && (
                  <Badge variant="outline" className="text-[8px] px-1 py-0 h-4">
                    Scanner
                  </Badge>
                )}
              </div>
            )}

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </>
        ) : (
          <>
            {/* Login Button */}
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => setShowLogin(true)}
            >
              <User className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Login</span>}
            </Button>

            {/* Signup Button */}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setShowSignup(true)}
            >
              {!collapsed ? "Sign Up" : "➕"}
            </Button>
          </>
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to Your Account</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {loginError && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                {loginError}
              </div>
            )}

            <Input
              placeholder="Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <Button 
              className="w-full" 
              onClick={login}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
                className="text-green-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={showSignup} onOpenChange={setShowSignup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Full Name"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
            />

            <Input
              placeholder="Email"
              type="email"
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

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
                className="text-green-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}