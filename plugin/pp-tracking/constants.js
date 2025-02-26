/**
 * Constants used throughout the PP Tracking plugin
 */

// Event types for link actions
export const LinkTypes = {
  INTERNAL: "INTERNAL",
  EXTERNAL: "EXTERNAL",
};

// Media types for media tracking
export const MediaTypes = {
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
};

// Media event types for tracking media interactions
export const MediaEventTypes = {
  PLAY: "PLAY",
  PAUSE: "PAUSE",
};

// Quiz event types for tracking quiz interactions
export const QuizEventTypes = {
  START: "START",
  COMPLETE: "COMPLETE",
};

// Default configuration for the plugin
export const DEFAULT_CONFIG = {
  apiConfig: {},
  dwellTimes: true,
  links: true,
  media: true,
  slideTransitions: true,
  revealDependencies: {
    quiz: false,
  },
  debug: false,
};

// Reveal.js events to track
export const TRACKED_REVEAL_EVENTS = ["slidechanged", "ready"];
