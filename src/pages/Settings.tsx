import { MainLayout } from '@/components/layout/MainLayout';
import { useTheme, ACCENT_COLORS } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sun, Moon, Monitor, Check, User, Palette, Layout } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, accentColor, setAccentColor, compactMode, setCompactMode } = useTheme();
  const { user } = useAuth();

  return (
    <MainLayout 
      title="Settings" 
      subtitle="Customize your experience"
    >
      <div className="max-w-2xl space-y-6">
        {/* Account Section */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Account</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto py-4 flex flex-col items-center gap-2 transition-all",
                    theme === 'light' && "border-primary bg-primary/5"
                  )}
                  onClick={() => setTheme('light')}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs">Light</span>
                  {theme === 'light' && (
                    <Check className="w-3 h-3 text-primary absolute top-2 right-2" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto py-4 flex flex-col items-center gap-2 transition-all relative",
                    theme === 'dark' && "border-primary bg-primary/5"
                  )}
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs">Dark</span>
                  {theme === 'dark' && (
                    <Check className="w-3 h-3 text-primary absolute top-2 right-2" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto py-4 flex flex-col items-center gap-2 transition-all relative",
                    theme === 'system' && "border-primary bg-primary/5"
                  )}
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs">System</span>
                  {theme === 'system' && (
                    <Check className="w-3 h-3 text-primary absolute top-2 right-2" />
                  )}
                </Button>
              </div>
            </div>

            {/* Accent Color Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Accent Color</Label>
              <div className="grid grid-cols-6 gap-3">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    className={cn(
                      "w-full aspect-square rounded-lg transition-all flex items-center justify-center",
                      color.preview,
                      accentColor === color.value 
                        ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" 
                        : "hover:scale-105"
                    )}
                    onClick={() => setAccentColor(color.value)}
                    title={color.label}
                  >
                    {accentColor === color.value && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {ACCENT_COLORS.find(c => c.value === accentColor)?.label}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Layout Section */}
        <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layout className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Layout</CardTitle>
                <CardDescription>Adjust the interface layout</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Compact Mode</p>
                <p className="text-sm text-muted-foreground">Reduce spacing for denser information display</p>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>Blume Tailoring & Embroidery • Version 1.0</p>
        </div>
      </div>
    </MainLayout>
  );
}
