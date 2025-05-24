
import React from "react";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "@/utils/toastUtils";
import { useEmployeeData } from "@/hooks/useEmployeeData";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { employees } = useEmployeeData();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      showSuccessToast("Vous avez été déconnecté avec succès");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileClick = () => {
    if (user?.isEmployee && user?.employeeId && employees) {
      // Find the employee record
      const employee = employees.find(emp => emp.id === user.employeeId);
      if (employee) {
        // Navigate to employees page and trigger view dialog
        navigate(`/employes?viewEmployee=${employee.id}`);
      }
    } else if (user?.isAdmin) {
      // For admin, navigate to settings
      navigate("/parametres");
    }
  };
  
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10 h-16">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-hr-text">
          <span className="text-hr">HR</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-hr text-white">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            {user && (
              <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                {user.email}
              </DropdownMenuLabel>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/parametres")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
