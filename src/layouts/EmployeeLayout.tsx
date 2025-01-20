import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function EmployeeLayout() {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Mijn Rooster', path: '/schedule' },
    { icon: Clock, label: 'Beschikbaarheid', path: '/availability' },
    { icon: User, label: 'Mijn Profiel', path: '/profile' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white px-4 py-3 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">
          <span className="text-red-600">Hot</span>
          <span className="text-gray-800">Networkz</span>
        </h1>
        <Button variant="ghost" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-10"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white shadow-md overflow-y-auto
      `}>
        <div className="p-6 hidden lg:block">
          <h1 className="text-2xl font-bold">
            <span className="text-red-600">Hot</span>
            <span className="text-gray-800">Networkz</span>
          </h1>
        </div>
        <nav className={`mt-6 ${isMobileMenuOpen ? 'mt-16 lg:mt-6' : ''}`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600"
            onClick={() => {
              signOut();
              setIsMobileMenuOpen(false);
            }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Uitloggen
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-0 lg:pt-0">
        <div className="p-4 lg:p-8 mt-14 lg:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default EmployeeLayout;