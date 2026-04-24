import { useApp } from "@/store/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export function SignIn() {
  return <AuthForm mode="signin" />;
}
export function SignUp() {
  return <AuthForm mode="signup" />;
}

function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const { setProfile } = useApp();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!email.trim()) return;
    setProfile((p) => ({
      ...p,
      name: mode === "signup" && name.trim() ? name.trim() : p.name === "You" ? email.split("@")[0] : p.name,
      fakeSession: { email: email.trim() },
      welcomedAt: p.welcomedAt ?? new Date().toISOString(),
    }));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-semibold tracking-wide">LifeOS</span>
          </div>
          <CardTitle className="text-2xl">
            {mode === "signup" ? "Create your operator account" : "Welcome back"}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Local-first. Your data stays in your browser.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {mode === "signup" && (
            <div>
              <Label>Display name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-auth-name"
              />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-auth-email"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="any value (local demo)"
              data-testid="input-auth-password"
            />
          </div>
          <Button onClick={submit} className="w-full" data-testid="button-auth-submit">
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
          <div className="text-xs text-muted-foreground text-center pt-2">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link href="/auth/sign-up" className="underline">
                  Create account
                </Link>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            <Link href="/" className="underline">Skip and continue as guest</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
