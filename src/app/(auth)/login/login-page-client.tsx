"use client";

import { ScissorsIcon } from "lucide-react";

import { LoginForm } from "@/features/auth";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { APP_NAME } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/i18n";

export function LoginPageClient() {
  const t = useTranslations();

  return (
    <main className="bg-muted/30 flex min-h-svh w-full flex-1 items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-sm">
            <ScissorsIcon className="size-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{APP_NAME}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("auth.welcomeBack")}</CardTitle>
            <CardDescription>{t("auth.signInDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
