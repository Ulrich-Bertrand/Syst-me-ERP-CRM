import { Ship, Plane, Truck, Package, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Badge } from './ui/badge';

interface TransportFiltersProps {
  selectedMode: string | null;
  selectedDirection: string | null;
  onModeChange: (mode: string | null) => void;
  onDirectionChange: (direction: string | null) => void;
}

export function TransportFilters({
  selectedMode,
  selectedDirection,
  onModeChange,
  onDirectionChange,
}: TransportFiltersProps) {
  const transportModes = [
    { id: 'maritime', label: 'Maritime', icon: Ship, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'aerien', label: 'Aérien', icon: Plane, color: 'bg-sky-50 text-sky-600 border-sky-200' },
    { id: 'terrestre', label: 'Terrestre', icon: Truck, color: 'bg-green-50 text-green-600 border-green-200' },
    { id: 'autres', label: 'Autres', icon: Package, color: 'bg-gray-50 text-gray-600 border-gray-200' },
  ];

  const directions = [
    { id: 'import', label: 'Import', icon: ArrowDownToLine, color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { id: 'export', label: 'Export', icon: ArrowUpFromLine, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  ];

  return (
    <div className="flex items-center gap-6">
      {/* Transport Mode Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Mode:</span>
        <div className="flex gap-2">
          {transportModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(isSelected ? null : mode.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? mode.color
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Direction Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sens:</span>
        <div className="flex gap-2">
          {directions.map((direction) => {
            const Icon = direction.icon;
            const isSelected = selectedDirection === direction.id;
            return (
              <button
                key={direction.id}
                onClick={() => onDirectionChange(isSelected ? null : direction.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? direction.color
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{direction.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedMode || selectedDirection) && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filtres actifs:</span>
          {selectedMode && (
            <Badge variant="secondary" className="text-xs">
              {transportModes.find(m => m.id === selectedMode)?.label}
            </Badge>
          )}
          {selectedDirection && (
            <Badge variant="secondary" className="text-xs">
              {directions.find(d => d.id === selectedDirection)?.label}
            </Badge>
          )}
          <button
            onClick={() => {
              onModeChange(null);
              onDirectionChange(null);
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  );
}
