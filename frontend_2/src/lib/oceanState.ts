/**
 * Central module-level state for the Ocean Canvas to avoid React re-renders.
 * All R3F components should read from this state synchronously in useFrame().
 */

export const oceanState = {
  scroll: 0,        // 0 to 1
  mouseX: 0,        // NDC -1 to 1
  mouseY: 0,        // NDC -1 to 1
  healed: false,
  sonarPulse: 0,    // 0 to 1
  
  // New cinematic properties
  timelineYear: 2025,
  scenario: "current", // "current" | "worst_case" | "optimistic" | "cleanup"
  accessibilityMode: "standard", // "standard" | "protanopia" | "deuteranopia" | "tritanopia" | "high_contrast" | "monochrome"
};

// Depth helpers based on scroll progress
export function getDepthZone() {
  const s = oceanState.scroll;
  if (s < 0.12) return "SURFACE";
  if (s < 0.28) return "SHALLOWS";
  if (s < 0.45) return "CORAL_FOREST";
  if (s < 0.60) return "TWILIGHT";
  if (s < 0.80) return "MIDNIGHT";
  if (s < 0.95) return "ABYSS";
  return "HADAL";
}

export function depthLerp(start: number, end: number, tStart: number, tEnd: number): number {
  let val = start + ((oceanState.scroll - tStart) / (tEnd - tStart)) * (end - start);
  if (start < end) {
    return Math.max(start, Math.min(end, val));
  } else {
    return Math.max(end, Math.min(start, val));
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    oceanState.scroll = Math.max(0, Math.min(1, window.scrollY / (maxScroll || 1)));
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    oceanState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    oceanState.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  window.addEventListener("click", () => {
    oceanState.sonarPulse = 1;
    // Broadcast standard DOM event for react components to sync
    window.dispatchEvent(new Event("trigger-sonar"));
  });

  window.addEventListener("trigger-sonar", () => {
    oceanState.sonarPulse = 1;
  });

  window.addEventListener("ocean-heal", () => {
    oceanState.healed = true;
    oceanState.scenario = "cleanup";
  });
}
