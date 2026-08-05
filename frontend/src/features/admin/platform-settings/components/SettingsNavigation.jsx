import React from "react";
import {
  Settings,
  Image as ImageIcon,
  Wrench,
  ToggleLeft,
  Mail,
  Shield,
} from "lucide-react";

const SECTIONS = [
  { id: "general", label: "General", icon: Settings },
  { id: "branding", label: "Branding", icon: ImageIcon },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "features", label: "Feature Flags", icon: ToggleLeft },
  { id: "email", label: "Email", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsNavigation({ activeSection, onSectionChange }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-2 sticky top-24">
      <nav className="flex flex-col gap-1">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-muted-foreground hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
