import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Apple, Check } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import hero from "@/assets/hero-2.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [pwd, setPwd] = useState("");

  const strength = Math.min(4, Math.floor(pwd.length / 3));
  const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"][strength];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Welcome to BugyBoo", description: "Your account has been created." });
    navigate("/");
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our little circle — softer stories, gentler fashion."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-foreground story-link">
            Sign in
          </Link>
        </>
      }
      side={
        <>
          <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-background">
            <ul className="space-y-2 text-sm">
              {["10% off your first order", "Early access to collections", "Heirloom gift wrapping"].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-background/30 flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">First name</span>
            <input
              required
              className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Last name</span>
            <input
              required
              className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Email</span>
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Password</span>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="At least 8 characters"
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
          {pwd && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      i < strength ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{strengthLabel}</span>
            </div>
          )}
        </label>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" required className="mt-1 accent-primary" />
          I agree to the <a href="#" className="text-foreground story-link">Terms</a> & <a href="#" className="text-foreground story-link">Privacy</a>.
        </label>
        <Button type="submit" size="lg" className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 shadow-soft">
          Create account
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

export default Signup;
