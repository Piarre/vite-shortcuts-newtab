import { ExternalLink, Github, Mail } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import SettingsBaseComponent from "./base";

const data = {
  appName: "Shortcuts New Tab",
  version: "0.0.0",
  links: [
    {
      label: "Source Code",
      icon: Github,
      url: "https://github.com/Piarre/vite-shortcuts-newtab",
    },
    {
      label: "Contact",
      icon: Mail,
      url: "mailto:contact@pierre-ide.fr",
    },
  ],
} as const;

const About = () => {
  return (
    <SettingsBaseComponent wrapperOnly className="justify-center items-center">
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src="/icon.svg" alt={data.appName} className="h-24 w-24" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold">{data.appName}</h3>
            <Badge variant="secondary" className="text-xs">
              v{data.version}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="w-full flex-row grid grid-cols-2 gap-2">
          {data.links.map((link) => (
            <Button key={link.label} variant="outline" size="sm" className="w-full h-8" asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <link.icon className="mr-2 h-3.5 w-3.5" />
                <span className="text-xs">{link.label}</span>
                <ExternalLink className="ml-auto h-3.5 w-3.5" />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </SettingsBaseComponent>
  );
};

export default About;
