"use client";
import { useEffect, useState } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => { /* ignore: the site works without it */ });
  }, []);
  return null;
}

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallButton({ loc }: { loc: "en" | "bn" }) {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) setInstalled(true);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e as InstallEvent); };
    const onInstalled = () => { setInstalled(true); setEvt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  const bn = loc === "bn";
  if (installed) return <p className="ph-note">{bn ? "অ্যাপটি ইনস্টল করা আছে।" : "The app is installed on this device."}</p>;
  if (evt) {
    return (
      <button type="button" className="dl-btn dl-btn-p" onClick={async () => { await evt.prompt(); await evt.userChoice; setEvt(null); }}>
        {bn ? "অ্যাপ ইনস্টল করুন" : "Install the app"}
      </button>
    );
  }
  return (
    <p className="ph-note">
      {ios
        ? bn ? "iPhone-এ: Safari খুলে Share চাপুন, তারপর “Add to Home Screen”।" : "On iPhone: open in Safari, tap Share, then “Add to Home Screen”."
        : bn ? "ইনস্টল করতে ঠিকানার বারে ইনস্টল আইকন বা ব্রাউজার মেনুতে “Install app” / “Add to Home screen” খুঁজুন।" : "To install, look for the install icon in the address bar, or “Install app” / “Add to Home screen” in the browser menu."}
    </p>
  );
}
