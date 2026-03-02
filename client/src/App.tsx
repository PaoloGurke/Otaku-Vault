import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Intro from "@/pages/intro";

function Router() {
  return (
    <Switch>

      <Route path="/" component={Intro} />
      <Route path="/home" component={Home} />

      {/* Always put 404 LAST */}
      <Route component={NotFound} />

    </Switch>
  );
}

function App() {

  // ⭐ THIS IS THE MAGIC FIX
  useEffect(() => {
    
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        {/* ⭐ GLOBAL CURSOR — PUT HERE */}
       <div id="cursor" className="Cursor">
  {Array.from({ length: 20 }).map((_, i) => (
    <span key={i}></span>
  ))}
</div>

        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;