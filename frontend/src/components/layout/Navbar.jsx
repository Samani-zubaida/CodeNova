import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Navbar = () => {
  const { theme, toggleTheme, user } = useAppStore();

  return (
    <nav className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">Code Nova</Link>
        <div className="hidden md:flex space-x-4 text-sm font-medium text-muted-foreground">
          <Link to="/sandbox" className="hover:text-primary transition-colors">Sandbox</Link>
          <Link to="/learn/data-structures" className="hover:text-primary transition-colors">Data Structures</Link>
          <Link to="/game" className="hover:text-primary transition-colors">3D Towns</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {user ? (
          <div className="flex items-center space-x-2 text-sm font-medium">
            <User size={20} className="text-secondary" />
            <span>{user.username}</span>
          </div>
        ) : (
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            Log In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
