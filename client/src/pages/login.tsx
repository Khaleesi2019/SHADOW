import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect to Replit auth
  const handleLogin = () => {
    window.location.href = '/api/login';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800"></div>
      
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
          <Shield className="h-10 w-10 text-white" />
        </div>
        
        <Card className="w-full bg-dark-800 border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Shadow Monitor</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to access your monitoring dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                className="w-full"
                onClick={handleLogin}
              >
                Sign In Securely
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-dark-800 px-2 text-gray-500">Secure Authentication</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 space-y-3">
              <p>
                Shadow Monitor provides comprehensive device monitoring and security management.
              </p>
              <p>
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
