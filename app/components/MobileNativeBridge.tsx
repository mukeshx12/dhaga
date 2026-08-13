"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Network } from "@capacitor/network";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { WifiOff } from "lucide-react";

export default function MobileNativeBridge() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let disposed = false;
    const listenerHandles: Array<{ remove: () => Promise<void> }> = [];

    document.documentElement.classList.add("native-app");
    void StatusBar.setOverlaysWebView({ overlay: false });
    void StatusBar.setBackgroundColor({ color: "#92400E" });
    void StatusBar.setStyle({ style: Style.Dark });
    void SplashScreen.hide();

    void Network.getStatus().then((status) => {
      if (!disposed) setOffline(!status.connected);
    });

    void Network.addListener("networkStatusChange", (status) => {
      setOffline(!status.connected);
    }).then((handle) => listenerHandles.push(handle));

    void App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else void App.exitApp();
    }).then((handle) => listenerHandles.push(handle));

    void App.addListener("appUrlOpen", ({ url }) => {
      try {
        const incoming = new URL(url);
        if (["joindhaga.com", "www.joindhaga.com"].includes(incoming.hostname)) {
          window.location.assign(`${incoming.pathname}${incoming.search}${incoming.hash}`);
        }
      } catch {
        // Ignore malformed external intents instead of interrupting the app.
      }
    }).then((handle) => listenerHandles.push(handle));

    return () => {
      disposed = true;
      document.documentElement.classList.remove("native-app");
      for (const handle of listenerHandles) void handle.remove();
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-x-3 top-3 z-[100] flex items-center gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-xl" role="status">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <WifiOff size={19} aria-hidden="true" />
      </span>
      <span>No internet connection. Dhaga will reconnect automatically.</span>
    </div>
  );
}
