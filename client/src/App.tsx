import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Dashboard from "@/pages/dashboard";
import LocationTracking from "@/pages/location-tracking";
import CameraControl from "@/pages/camera-control";
import AudioRecordings from "@/pages/audio-recordings";
import CallSmsLogs from "@/pages/call-sms-logs";
import DeviceControl from "@/pages/device-control";
import StealthSettings from "@/pages/stealth-settings";
import CommandHistory from "@/pages/command-history";
import Settings from "@/pages/settings";
import DeviceDetail from "@/pages/device-detail";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/location-tracking" component={LocationTracking} />
      <Route path="/camera-control" component={CameraControl} />
      <Route path="/audio-recordings" component={AudioRecordings} />
      <Route path="/call-sms-logs" component={CallSmsLogs} />
      <Route path="/device-control" component={DeviceControl} />
      <Route path="/stealth-settings" component={StealthSettings} />
      <Route path="/command-history" component={CommandHistory} />
      <Route path="/settings" component={Settings} />
      {/* Device detail route removed temporarily until the page is created */}
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
