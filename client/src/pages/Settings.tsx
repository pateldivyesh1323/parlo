import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdatePersonalInfo, useUpdatePreferences } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { languages } from "@/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import QRCode from "react-qr-code";

export default function Settings() {
  const { user, userPreferences, loading } = useAuth();
  const updatePersonalInfoMutation = useUpdatePersonalInfo();
  const updatePreferencesMutation = useUpdatePreferences();

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
  });

  const [preferences, setPreferences] = useState({
    translationLanguage: "en",
    translateByDefault: false,
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        translationLanguage: userPreferences.translationLanguage || "en",
        translateByDefault: userPreferences.translateByDefault,
      });
    }
  }, [userPreferences]);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalInfo.name.trim()) return;

    updatePersonalInfoMutation.mutate({
      name: personalInfo.name,
    });
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferencesMutation.mutate(preferences);
  };

  const getLanguageName = (code: string) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? `${language.name} (${language.nativeName})` : code;
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Share QR Code to quickly add you to a chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QRCode
            value={`type=user&id=${user._id}`}
            className="mx-auto h-24"
            size={256}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={personalInfo.name}
                onChange={(e) =>
                  setPersonalInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Email cannot be changed as it's managed by your authentication
                provider.
              </p>
            </div>

            <Button
              type="submit"
              disabled={
                updatePersonalInfoMutation.isPending ||
                !personalInfo.name.trim()
              }
            >
              {updatePersonalInfoMutation.isPending
                ? "Updating..."
                : "Update Personal Info"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePreferencesSubmit} className="space-y-4">
            <label
              className="text-sm text-muted-foreground"
              id="language-label"
            >
              Select your preferred language for translation features.
            </label>
            <Select
              defaultValue={preferences.translationLanguage}
              onValueChange={(code) => {
                setPreferences((prev) => ({
                  ...prev,
                  translationLanguage: code,
                }));
              }}
              aria-labelledby="language-label"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Language">
                  {getLanguageName(preferences.translationLanguage)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Translation Language</SelectLabel>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {getLanguageName(language.code)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch
                id="translateByDefault"
                checked={preferences.translateByDefault}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    translateByDefault: checked,
                  }))
                }
              />
              <Label htmlFor="translateByDefault">
                Translate language by default
              </Label>
            </div>

            <Button
              type="submit"
              disabled={updatePreferencesMutation.isPending}
            >
              {updatePreferencesMutation.isPending
                ? "Updating..."
                : "Update Preferences"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
