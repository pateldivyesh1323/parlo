import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useGetUserPreferences,
  useUpdatePersonalInfo,
  useUpdatePreferences,
} from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { languages } from "@/constants";

export default function Settings() {
  const { user } = useAuth();
  const { data: userPreferences, isLoading: preferencesLoading } =
    useGetUserPreferences();
  const updatePersonalInfoMutation = useUpdatePersonalInfo();
  const updatePreferencesMutation = useUpdatePreferences();

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
  });

  const [preferences, setPreferences] = useState({
    translationLanguage: "en",
  });

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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

    updatePreferencesMutation.mutate({
      translationLanguage: preferences.translationLanguage,
    });
  };

  const getLanguageName = (code: string) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? `${language.name} (${language.nativeName})` : code;
  };

  if (!user || preferencesLoading) {
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
            <div>
              <Label htmlFor="language">Translation Language</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                >
                  {getLanguageName(preferences.translationLanguage)}
                  <span className="ml-2">▼</span>
                </Button>

                {showLanguageDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => {
                          setPreferences((prev) => ({
                            ...prev,
                            translationLanguage: language.code,
                          }));
                          setShowLanguageDropdown(false);
                        }}
                      >
                        {language.name} ({language.nativeName})
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Select your preferred language for translation features.
              </p>
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
