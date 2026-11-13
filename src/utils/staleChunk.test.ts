import { describe, expect, it } from "vitest";
import { shouldReloadForStaleChunk } from "./staleChunk";

describe("shouldReloadForStaleChunk", () => {
  const now = 1_000_000;

  it("reloads the first time a module from an older deploy fails to load", () => {
    expect(shouldReloadForStaleChunk(null, now)).toBe(true);
  });

  it("does not reload again right after a reload, so a missing file never loops", () => {
    expect(shouldReloadForStaleChunk(String(now - 5_000), now)).toBe(false);
  });

  it("reloads again once the previous reload is old", () => {
    expect(shouldReloadForStaleChunk(String(now - 60_000), now)).toBe(true);
  });

  it("treats an unreadable mark as no previous reload", () => {
    expect(shouldReloadForStaleChunk("garbage", now)).toBe(true);
  });
});
