import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Apple, Check } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import hero from "@/assets/hero-2.jpg";
import { signup } from "@/lib/api";
import GoogleAuthButton from "@/components/GoogleAuthButton";


const Signup = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pwd, setPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strength = Math.min(4, Math.floor(pwd.length / 3));
  const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"][strength];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !mobile || !pwd) {
      toast({ title: "Missing information", description: "Please complete all fields to register." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup(name, email, mobile, pwd);
      toast({ title: "Account created", description: response.message });
      navigate("/login");
    } catch (error) {
      toast({ title: "Signup failed", description: error instanceof Error ? error.message : "Unable to create account." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our little circle — softer stories, gentler fashion."
      footer={null}
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
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="bugyboo"
            className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Mobile</span>
          <input
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="8744953803"
            className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
          />
        </label>
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
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Password</span>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
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
        <Button type="submit" size="lg" className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 shadow-soft" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      <div className="flex flex-col gap-3">
        <GoogleAuthButton />
        <Button variant="outline" className="rounded-full h-12">
          <Apple className="h-4 w-4 mr-2" />
          Apple
        </Button>
      </div>

    </AuthLayout>
  );
};

export default Signup;
