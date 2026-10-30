import { describe, expect, it } from "vitest";
import { computeInstallMode, isIos } from "./install";
import type { BeforeInstallPromptEvent } from "./install";

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const IPAD_AS_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const MAC_DESKTOP = IPAD_AS_MAC;
const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

const event = {} as BeforeInstallPromptEvent;
const base = { deferred: null, installed: false, ios: false, standalone: false };

describe("isIos", () => {
  it("detects iPhone", () => {
    expect(isIos(IPHONE_SAFARI, 5)).toBe(true);
  });

  it("detects an iPad that reports itself as a Mac, by its touch screen", () => {
    expect(isIos(IPAD_AS_MAC, 5)).toBe(true);
  });

  it("does not take a real Mac for an iPad", () => {
    expect(isIos(MAC_DESKTOP, 0)).toBe(false);
  });

  it("does not take Android for iOS", () => {
    expect(isIos(ANDROID_CHROME, 5)).toBe(false);
  });
});

describe("computeInstallMode", () => {
  it("offers the native dialog when the browser handed us the install event", () => {
    expect(computeInstallMode({ ...base, deferred: event })).toBe("native");
  });

  it("explains the manual steps on iOS, where there is no install event", () => {
    expect(computeInstallMode({ ...base, ios: true })).toBe("ios");
  });

  it("offers nothing on a browser that cannot install", () => {
    expect(computeInstallMode(base)).toBeNull();
  });

  it("offers nothing once the app is running installed", () => {
    expect(computeInstallMode({ ...base, deferred: event, standalone: true })).toBeNull();
    expect(computeInstallMode({ ...base, ios: true, standalone: true })).toBeNull();
  });

  it("offers nothing right after installing, before the page is reopened", () => {
    expect(computeInstallMode({ ...base, deferred: event, installed: true })).toBeNull();
  });

  it("prefers the native dialog over the iOS explanation", () => {
    expect(computeInstallMode({ ...base, deferred: event, ios: true })).toBe("native");
  });
});
