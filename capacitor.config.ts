import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL || "https://www.joindhaga.com";
const isLocalAndroidDevelopment = serverUrl.startsWith("http://");
const localDevelopmentHosts = isLocalAndroidDevelopment
  ? ["localhost", "127.0.0.1", "10.0.2.2"]
  : [];

const config: CapacitorConfig = {
  appId: "com.joindhaga.app",
  appName: "Dhaga",
  webDir: "public",
  server: {
    url: serverUrl,
    cleartext: isLocalAndroidDevelopment,
    androidScheme: isLocalAndroidDevelopment ? "http" : "https",
    allowNavigation: [
      "www.joindhaga.com",
      "joindhaga.com",
      ...localDevelopmentHosts,
    ],
  },
  android: {
    backgroundColor: "#FAF7F2",
    allowMixedContent: isLocalAndroidDevelopment,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: "#FAF7F2",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#92400E",
      style: "DARK",
    },
  },
};

export default config;
