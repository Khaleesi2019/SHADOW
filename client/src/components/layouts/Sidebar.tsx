import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Shield,
  LayoutDashboard,
  MapPin,
  Camera,
  Mic,
  Phone,
  Settings,
  EyeOff,
  History,
  Sliders,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getInitials = () => {
    if (!user) return 'AU';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.email ? user.email[0].toUpperCase() : 'AU';
  };

  const getName = () => {
    if (!user) return 'Admin User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email || 'Admin User';
  };

  const navigationItems = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { href: '/location-tracking', label: 'Location Tracking', icon: <MapPin className="mr-3 h-5 w-5" /> },
    { href: '/camera-control', label: 'Camera Control', icon: <Camera className="mr-3 h-5 w-5" /> },
    { href: '/audio-recordings', label: 'Audio Recordings', icon: <Mic className="mr-3 h-5 w-5" /> },
    { href: '/call-sms-logs', label: 'Call & SMS Logs', icon: <Phone className="mr-3 h-5 w-5" /> },
    { href: '/device-control', label: 'Device Control', icon: <Settings className="mr-3 h-5 w-5" /> },
    { href: '/stealth-settings', label: 'Stealth Settings', icon: <EyeOff className="mr-3 h-5 w-5" /> },
    { href: '/command-history', label: 'Command History', icon: <History className="mr-3 h-5 w-5" /> },
    { href: '/settings', label: 'Settings', icon: <Sliders className="mr-3 h-5 w-5" /> },
  ];

  return (
    <>
      <aside className={`w-full md:w-64 bg-dark-800 border-r border-gray-800 md:flex md:flex-col ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden md:flex'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ShadowMonitor</h1>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-4 py-2">
          <div className="bg-dark-900 rounded-lg p-2 mb-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="bg-gray-700 text-gray-300">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-300">{getName()}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="px-2 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                location === item.href
                  ? 'bg-primary-800 text-white'
                  : 'text-gray-300 hover:bg-dark-900 hover:text-white'
              } group`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="px-4 mt-6 mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center px-4 py-2 border border-red-700 text-red-500 hover:bg-red-900 hover:text-red-400"
            onClick={() => window.location.href = '/api/logout'}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-40 p-4">
        <button
          className="bg-dark-800 text-gray-400 hover:text-white p-2 rounded-md"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
