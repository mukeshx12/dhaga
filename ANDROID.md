# Dhaga Android app

The Android project is a Capacitor native container for the production Dhaga
application at `https://www.joindhaga.com`. This keeps customer, tailor and
admin behavior on the same tested Next.js codebase while adding Android-native
navigation, deep links, status-bar styling, splash behavior and network status.

## Requirements

- Android Studio with Android SDK 36
- Java 21 (Android Studio's bundled JDK is recommended)
- An Android phone with USB debugging enabled, or an Android emulator

## Open and run

```bash
npm install
npm run android:sync
npm run android:open
```

In Android Studio, wait for Gradle sync, select a device, and press **Run**.
The app requires internet access because the production Next.js application is
server-rendered and uses Neon, NextAuth, OTP and booking APIs.

## See local UI changes in the emulator

The normal Android build opens the deployed website. For live development,
use two terminal windows.

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run android:dev:sync
```

Then run the app again from Android Studio. Android emulators use
`10.0.2.2` to reach the Mac's `localhost`. Hot reload will show most UI edits
without rebuilding the APK.

Before creating an APK or Play Store bundle, restore production mode:

```bash
npm run android:prod:sync
```

## Test local changes on a physical Android phone

Enable Developer options and USB debugging on the phone, connect it to the Mac
with a data-capable USB cable, and approve the phone's "Allow USB debugging"
dialog. Then run:

```bash
npm run android:devices
npm run android:device:connect
npm run android:device:sync
```

Keep `npm run dev` running in another terminal, select the phone in Android
Studio, and press Run. USB port forwarding lets the phone open the Mac's local
Dhaga server through `localhost:3000` without exposing the server over Wi-Fi.

## Create a test APK

In Android Studio select **Build → Build App Bundles or APKs → Build APKs**.
For Play Store release, use **Build → Generate Signed App Bundle or APK** and
choose Android App Bundle (`.aab`). Keep the signing keystore private and back
it up securely; losing it can prevent future app updates.

## After web changes

Normal Dhaga feature and UI changes deploy through Vercel and become available
inside the app without an Android rebuild. Run `npm run android:sync` when a
Capacitor plugin, `capacitor.config.ts`, Android resource, or native behavior
changes.

## Recommended phase-two native improvements

1. Firebase push notifications for new bookings, quotations and status changes.
2. Native camera/gallery compression with object storage instead of base64
   photos in Postgres.
3. Location permission and coordinates for genuinely nearest-tailor results.
4. Biometric re-entry for returning users, while retaining OTP/password login.
5. Play Integrity checks and crash reporting before public promotion.
