import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Bell, Sparkles, X, LogOut, User, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/slices/authSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { ROUTES } from "@/constants/routes";
import { ROLE_OPTIONS } from "@/constants/roles";
import { INITIAL_ALERTS } from "@/constants/dashboardMockData";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const roleLabel = ROLE_OPTIONS.find((r) => r.value === user?.role)?.label ?? "Guest";
  const initial = user?.fullName?.charAt(0).toUpperCase() ?? "A";

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="fixed top-0 left-0 w-full lg:left-[260px] lg:w-[calc(100%-260px)] h-16 bg-card/90 backdrop-blur border-b border-border z-20 flex items-center justify-between gap-3 px-4 sm:px-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block w-56 md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search drugs, patients, departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/80 border border-border rounded-full text-xs placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-card transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-secondary border border-primary/20 text-primary rounded-full text-xs font-semibold">
          <Sparkles size={13} />
          <span>AI Monitoring Active</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications((s) => !s)}
            className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-xl p-4 z-50 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-bold">Live Discrepancy Alerts</span>
                <span className="text-[10px] text-primary font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2">
                {INITIAL_ALERTS.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-2.5 rounded-xl bg-muted/60 border border-border hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{a.drug}</span>
                      <span className="text-[10px] text-muted-foreground">{a.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full pr-1 hover:bg-muted transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-tight">{user?.fullName ?? "Administrator"}</p>
                <p className="text-[10px] text-muted-foreground">{roleLabel} • {user?.hospitalName ?? "AIIMS"}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{initial}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="h-4 w-4" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}