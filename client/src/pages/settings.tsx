import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Key,
  Database,
  Save
} from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your account preferences and analysis settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <User className="mr-3 h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="mt-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="mt-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" className="mt-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white" />
              </div>
              <div>
                <Label htmlFor="organization" className="text-gray-700 dark:text-gray-300">Organization</Label>
                <Input id="organization" defaultValue="Web3 Startup Inc." className="mt-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Analysis Preferences */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <SettingsIcon className="mr-3 h-5 w-5" />
                Analysis Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Auto-save analysis results</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save analysis results to your history</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-600" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Include TVL data</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Show Total Value Locked information when available</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-600" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Advanced scoring metrics</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Display detailed scoring breakdowns</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Email notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new partner matches</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gray-200 dark:bg-gray-600" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Weekly reports</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get weekly summaries of partnership opportunities</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <SettingsIcon className="mr-3 h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Theme</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Key className="mr-3 h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey" className="text-gray-700 dark:text-gray-300">OpenAI API Key</Label>
                <Input 
                  id="apiKey" 
                  type="password" 
                  placeholder="sk-..." 
                  className="mt-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white" 
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your OpenAI API key for partner analysis</p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-primary text-white hover:bg-indigo-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}