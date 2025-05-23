
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquare, X, LayoutGrid } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface Widget {
  id: string;
  title: string;
  type: "chart" | "stat" | "info";
  enabled: boolean;
}

interface DashboardWidgetManagerProps {
  widgets: Widget[];
  onWidgetsChange: (widgets: Widget[]) => void;
}

const DashboardWidgetManager: React.FC<DashboardWidgetManagerProps> = ({
  widgets,
  onWidgetsChange,
}) => {
  const [open, setOpen] = useState(false);
  const [localWidgets, setLocalWidgets] = useState<Widget[]>(widgets);

  const handleOpen = () => {
    setLocalWidgets([...widgets]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onWidgetsChange(localWidgets);
    setOpen(false);
  };

  const handleToggleWidget = (id: string) => {
    setLocalWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <LayoutGrid className="mr-2 h-4 w-4" />
        Personnaliser
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Personnaliser le tableau de bord</DialogTitle>
            <DialogDescription>
              Sélectionnez les tableaux et graphiques à afficher sur votre dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {localWidgets.map((widget) => (
                <div key={widget.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={widget.id}
                    checked={widget.enabled}
                    onCheckedChange={() => handleToggleWidget(widget.id)}
                  />
                  <Label htmlFor={widget.id} className="cursor-pointer flex-1">
                    {widget.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-hr hover:bg-hr-dark">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardWidgetManager;
