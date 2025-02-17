import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, X } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

interface MedicationSchedule {
  [key: string]: {
    status: string;
    time: string;
  }[];
}

interface MedicationDisplayProps {
  medication: string | MedicationSchedule;
  variant?: "compact" | "full";
}

export function MedicationDisplay({ medication, variant = "full" }: MedicationDisplayProps) {
  if (typeof medication === "string") {
    try {
      medication = JSON.parse(medication);
    } catch (e) {
      return (
        <div className="text-sm text-slate-600">
          {medication || "No medication data available"}
        </div>
      );
    }
  }

  if (!medication || typeof medication !== "object" || !medication.medication_schedule) {
    return (
      <div className="text-sm text-slate-600">
        No medication schedule available
      </div>
    );
  }

  const schedule = medication.medication_schedule;

  if (variant === "compact") {
    return (
      <div className="space-y-2">
        {Object.entries(schedule).map(([name, times]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">{name}</span>
            <Badge variant="secondary" className="text-xs">
              {times.length} time{times.length !== 1 ? 's' : ''}/day
            </Badge>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(schedule).map(([name, times], index) => (
        <Card key={name} className="bg-slate-50 border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">{name}</h4>
              <Badge variant="secondary" className="bg-slate-200">
                {times.length} time{times.length !== 1 ? 's' : ''}/day
              </Badge>
            </div>
            <div className="space-y-2">
              {times.map((time, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-white">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">{time.time}</span>
                  </div>
                  <Badge 
                    variant={time.status === "taken" ? "default" : "secondary"}
                    className={`flex items-center gap-1 ${
                      time.status === "taken" 
                        ? "bg-green-100 text-green-700 hover:bg-green-100" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {time.status === "taken" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {time.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
