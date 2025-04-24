
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";

interface LocationInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSuggest: () => void;
  isLoading: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  id,
  label,
  value,
  onChange,
  onSuggest,
  isLoading
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input 
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-24"
          placeholder={`Enter ${label.toLowerCase()}`}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
          onClick={onSuggest}
          disabled={isLoading || !value}
        >
          {isLoading ? "Suggesting..." : "Suggest"}
        </Button>
      </div>
    </div>
  );
};
