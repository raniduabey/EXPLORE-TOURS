import React from "react";
import {
  Clock,
  Users,
  Languages,
  CheckCircle,
  ShieldCheck,
  Compass,
  MapPin,
  Calendar,
  Car,
  Sparkles,
  Award,
  HeartHandshake,
  DollarSign,
  Coffee,
  Camera,
  Sun,
  Mountain,
  Waves,
  Binoculars,
  Utensils,
  Hotel,
  Ticket,
  Footprints,
  Plane,
  Trees,
  Gem,
} from "lucide-react";

export const AVAILABLE_TOUR_ICONS = [
  { id: "Clock", name: "Clock", label: "Clock / Duration", icon: Clock },
  { id: "Users", name: "Users", label: "Users / Travellers", icon: Users },
  { id: "Languages", name: "Languages", label: "Languages / Guide", icon: Languages },
  { id: "CheckCircle", name: "CheckCircle", label: "Checkmark / Policy", icon: CheckCircle },
  { id: "ShieldCheck", name: "ShieldCheck", label: "Shield / Safety", icon: ShieldCheck },
  { id: "Compass", name: "Compass", label: "Compass / Journey", icon: Compass },
  { id: "MapPin", name: "MapPin", label: "Map Pin / Location", icon: MapPin },
  { id: "Calendar", name: "Calendar", label: "Calendar / Dates", icon: Calendar },
  { id: "Car", name: "Car", label: "Car / Chauffeur", icon: Car },
  { id: "Sparkles", name: "Sparkles", label: "Sparkles / Signature", icon: Sparkles },
  { id: "Award", name: "Award", label: "Award / Premium", icon: Award },
  { id: "HeartHandshake", name: "HeartHandshake", label: "Handshake / Hospitality", icon: HeartHandshake },
  { id: "DollarSign", name: "DollarSign", label: "Dollar / All-Inclusive", icon: DollarSign },
  { id: "Coffee", name: "Coffee", label: "Coffee / Refreshments", icon: Coffee },
  { id: "Camera", name: "Camera", label: "Camera / Sightseeing", icon: Camera },
  { id: "Sun", name: "Sun", label: "Sun / Weather", icon: Sun },
  { id: "Mountain", name: "Mountain", label: "Mountain / Highlands", icon: Mountain },
  { id: "Waves", name: "Waves", label: "Waves / Coastline", icon: Waves },
  { id: "Binoculars", name: "Binoculars", label: "Binoculars / Safari", icon: Binoculars },
  { id: "Utensils", name: "Utensils", label: "Utensils / Dining", icon: Utensils },
  { id: "Hotel", name: "Hotel", label: "Hotel / Lodging", icon: Hotel },
  { id: "Ticket", name: "Ticket", label: "Ticket / Admission", icon: Ticket },
  { id: "Footprints", name: "Footprints", label: "Footprints / Walking", icon: Footprints },
  { id: "Plane", name: "Plane", label: "Plane / Transfer", icon: Plane },
  { id: "Trees", name: "Trees", label: "Trees / Nature", icon: Trees },
  { id: "Gem", name: "Gem", label: "Gem / Luxury Exclusive", icon: Gem },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  Users,
  Languages,
  CheckCircle,
  ShieldCheck,
  Compass,
  MapPin,
  Calendar,
  Car,
  Sparkles,
  Award,
  HeartHandshake,
  DollarSign,
  Coffee,
  Camera,
  Sun,
  Mountain,
  Waves,
  Binoculars,
  Utensils,
  Hotel,
  Ticket,
  Footprints,
  Plane,
  Trees,
  Gem,
};

interface DynamicIconProps {
  name?: string | null;
  icon?: string | null;
  className?: string;
  defaultIcon?: React.ComponentType<{ className?: string }>;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  icon,
  className = "w-5 h-5 text-luxury-gold",
  defaultIcon: DefaultIcon = Sparkles,
}) => {
  const iconName = name || icon;
  if (!iconName) return <DefaultIcon className={className} />;
  const Comp = ICON_MAP[iconName] || DefaultIcon;
  return <Comp className={className} />;
};

export default DynamicIcon;
