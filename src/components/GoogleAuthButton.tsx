import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { googleLogin } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function GoogleAuthButton() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast({
        title: "Google sign-in failed",
        description: "No credential received from Google. Please try again.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Send Google credential token to the backend endpoint
      const response = await googleLogin(credentialResponse.credential);
      
      // Save JWT token, refresh token and user data exactly like the existing flow does
      setAuth(response.accessToken, response.refreshToken, response.user);
      
      toast({
        title: "Welcome back",
        description: `Successfully signed in as ${response.user.name}.`,
      });

      // Redirect safely to homepage or the requested redirectUrl
      const redirectUrl = searchParams.get("redirectUrl");
      navigate(redirectUrl || "/", { replace: true });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Unable to sign in using Google.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    toast({
      title: "Google sign-in failed",
      description: "Google popup closed or connection failed. Please try again.",
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-2">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 h-11 w-full text-muted-foreground text-sm border border-border rounded-full bg-card shadow-soft">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Signing in with Google...
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="outline"
            size="large"
            text="continue_with"
            shape="pill"
            width="384px" // Standard width matching max-w-sm form fields for premium look
          />
        </div>
      )}
    </div>
  );
}
