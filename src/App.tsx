import { supabase } from './supabaseClient'
import { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import MintProduct from "./pages/MintProduct";
import BatchHistory from "./pages/BatchHistory";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {
    checkDB()
  }, [])

  async function checkDB(){
    const { data, error } = await supabase
      .from("Product_tracking")
      .select('*')

    console.log("DATA:", data)
    console.log("ERROR:", error)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mint" element={<MintProduct />} />
              <Route path="/batch-history" element={<BatchHistory />} />
              
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

