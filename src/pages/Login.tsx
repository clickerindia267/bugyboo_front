import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Apple } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import hero from "@/assets/hero-1.jpg";
import { login } from "@/lib/api";
import { useAuth } from "@/store/auth";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuth();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({ title: "Missing credentials", description: "Please enter both email and password." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password);
      setAuth(response.accessToken, response.refreshToken, response.user);
      toast({ title: "Welcome back", description: "Signed in successfully." });

      // Redirect to the page the user was trying to visit, or homepage
      const redirectUrl = searchParams.get("redirectUrl");
      navigate(redirectUrl || "/", { replace: true });
    } catch (error) {
      toast({ title: "Login failed", description: error instanceof Error ? error.message : "Unable to sign in." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your little Lune story."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="text-foreground story-link">
            Create an account
          </Link>
        </>
      }
      side={
        <>
          <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-background">
            <p className="text-xs uppercase tracking-[0.3em] mb-3 opacity-80">Spring · Summer 26</p>
            <h2 className="font-serif text-4xl italic">Petals &amp; Pearls</h2>
          </div>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@bugyboo.com"
            className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
          />
        </label>
        <label className="block">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Password</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground story-link">Forgot?</a>
          </div>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Avish@123"
              className="w-full h-12 px-4 pr-12 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="accent-primary" />
          Keep me signed in
        </label>
        <Button type="submit" size="lg" className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 shadow-soft" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="rounded-full h-12">
          <svg viewBox="0 0 48 48" className="h-4 w-4 mr-2"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Google
        </Button>
        <Button variant="outline" className="rounded-full h-12">
          <Apple className="h-4 w-4 mr-2" />
          Apple
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Login;
