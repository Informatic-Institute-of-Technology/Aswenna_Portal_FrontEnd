import { authService } from "@/services";
import type { AuthBroadcastMessage } from "@/services/auth.service";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "./createAuthContext";
import { AuthContext } from "./createAuthContext";

const IDLE_TOUCH_THROTTLE_MS = 1_000;

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const expiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleActivity = useCallback(() => {
    authService.touchIdleTimer();
  }, []);

  useEffect(() => {
    if (!user) return;
    let lastTouch = 0;
    const throttled = () => {
      const now = Date.now();
      if (now - lastTouch > IDLE_TOUCH_THROTTLE_MS) {
        lastTouch = now;
        handleActivity();
      }
    };
    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, throttled, { passive: true }),
    );
    return () =>
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, throttled),
      );
  }, [user, handleActivity]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        authService.isSessionExpired()
      ) {
        handleLogout();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("aswenna_auth");
      bc.onmessage = (e: MessageEvent<AuthBroadcastMessage>) => {
        switch (e.data?.type) {
          case "LOGOUT":
            console.info("[Auth] Another tab signed out.");
            break;
          case "LOGIN":
            console.info(
              `[Auth] Another tab signed in as ${e.data.role ?? "unknown"}.`,
            );
            break;
        }
      };
    } catch {
      console.warn("BroadcastChannel not supported in this browser.");
    }
    return () => {
      bc?.close();
    };
  }, []);

  useEffect(() => {
    authService
      .restoreSession()
      .then((result) => {
        if (result) {
          setUser(result.user);
          setSessionId(result.sessionId);
        }
      })
      .finally(() => setInitializing(false));
  }, []);

  useEffect(() => {
    if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
    if (!user) return;

    expiryTimerRef.current = setInterval(() => {
      if (authService.isSessionExpired()) {
        handleLogout();
      }
    }, 30_000);

    return () => {
      if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.login({ email, password });
      setUser(userData);
      setSessionId(authService.getSessionId());
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setSessionId(null);
  };

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await authService.updateSessionUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        loading,
        initializing,
        login,
        logout: handleLogout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
