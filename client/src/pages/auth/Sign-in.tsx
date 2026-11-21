import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, LogIn, Store } from "lucide-react";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const user = await login({ email: email.trim(), password });
      toast.success("Welcome back, " + user.name + "!");

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background px-4 py-12">
      <Card className="w-full max-w-md border-border/60 shadow-2xl shadow-primary/5">
        <CardHeader className="space-y-4 px-6 pb-4 pt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <LogIn className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-6 pb-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-4">
            <Button type="submit" className="w-full gap-2 h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
