/**
 * Central module-level state for the Ocean Canvas to avoid React re-renders.
 * All R3F components should read from this state synchronously in useFrame().
 */

export const oceanState = {
  scroll: 0,        // 0 to 1
  mouseX: 0,        // NDC -1 to 1
  mouseY: 0,        // NDC -1 to 1
  healed: false,
  lastSonarTime: -100,
  
  // Cinematic Properties
  timelineYear: 2025,
  scenario: "current", // "current" | "worst_case" | "optimistic" | "cleanup"
  accessibilityMode: "standard", 
  
  // New: Chapter & Discovery Tracking
  currentChapter: 1, // 1 to 7
  discoveredSpecies: [] as string[],
  
  // New: AI Scanner
  scanTarget: null as any | null, // { id: string, name: string, confidence: number, pop: string, status: string, depth: string, location: string, screenPos: {x,y} }
  
  // New: Legendary Encounter
  legendaryEvent: null as string | null, // "blue_whale" | "giant_squid" | null
  
  // Physics/Currents
  currentVelocity: { x: 0.1, y: 0.05, z: 0.02 },
};

// Depth helpers based on scroll progress
export function getDepthZone() {
  const s = oceanState.scroll;
  if (s < 0.15) { oceanState.currentChapter = 1; return "SURFACE"; } // Chapter 1: The Sunlit Ocean
  if (s < 0.30) { oceanState.currentChapter = 2; return "SHALLOWS"; } // Chapter 2: Coral Kingdom
  if (s < 0.50) { oceanState.currentChapter = 3; return "TWILIGHT"; } // Chapter 3: Twilight Waters
  if (s < 0.70) { oceanState.currentChapter = 4; return "MIDNIGHT"; } // Chapter 4: The Midnight Ocean
  if (s < 0.85) { oceanState.currentChapter = 5; return "ABYSS"; }    // Chapter 5: The Abyss
  if (s < 0.95) { oceanState.currentChapter = 6; return "HADAL"; }    // Chapter 6: The Hidden World
  oceanState.currentChapter = 7; return "RESTORATION";                // Chapter 7: Saving Earth's Oceans
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
    oceanState.lastSonarTime = performance.now() / 1000;
    // Broadcast standard DOM event for react components to sync
    window.dispatchEvent(new Event("trigger-sonar"));
  });

  window.addEventListener("trigger-sonar", () => {
    oceanState.lastSonarTime = performance.now() / 1000;
  });

  window.addEventListener("ocean-heal", () => {
    oceanState.healed = true;
    oceanState.scenario = "cleanup";
  });
}
