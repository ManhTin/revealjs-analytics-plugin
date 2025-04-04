/*!
 * reveal-analytics plugin v1.0.0
 * Manh Tin Nguyen
 * MIT licensed
 *
 * Copyright (C) 2025 Manh Tin Nguyen
 */

import { DEFAULT_CONFIG } from "./constants";
import { OptOutManager } from "./opt-out";
import { Timer } from "./timer";
import {
  trackClosing,
  trackDwellTimes,
  trackLinks,
  trackMediaActions,
  trackQuizzes,
  trackStart,
} from "./trackers";
import { tracksDwellTimePerSlide } from "./utils";

/**
 * PP Tracking Plugin for reveal.js
 * Tracks user interactions with presentation
 */
const Plugin = () => {
  // Merge default config with user config
  const config = { ...DEFAULT_CONFIG, ...Reveal.getConfig().revealAnalytics };

  // Event logging arrays
  const eventLogs = {
    logPresentationStartEvents: [],
    logPresentationCloseEvents: [],
    logSlideViewEvents: [],
    logLinkActionEvents: [],
    logMediaActionEvents: [],
    logQuizActionEvents: [],
  };

  // Initialize opt-out manager
  const optOutManager = new OptOutManager(config.optOut);

  // Validate API configuration
  if (!config.apiConfig.trackingAPI) {
    console.error(
      "You have no trackingAPI configured where to send tracking data to!",
    );
    return null;
  }

  // Initialize timers
  const globalTimer = new Timer();
  const slideTimer = new Timer();

  /**
   * Starts all necessary timers based on configuration
   */
  const startTimers = () => {
    globalTimer.start();

    if (tracksDwellTimePerSlide(config)) {
      slideTimer.start();
    }
  };

  /**
   * Adds all event listeners for tracking
   */
  const addEventListeners = () => {
    trackStart(config, eventLogs.logPresentationStartEvents);
    trackDwellTimes(config, eventLogs.logSlideViewEvents, slideTimer);
    trackClosing(config, eventLogs, globalTimer, optOutManager);
    trackLinks(config, eventLogs.logLinkActionEvents);
    trackMediaActions(config, eventLogs.logMediaActionEvents);
    trackQuizzes(config, eventLogs.logQuizActionEvents);
  };

  function setupOptOut() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "plugin/reveal-analytics/css/opt-out.css";
    document.head.appendChild(link);

    // Initialize opt-out manager
    optOutManager.init();
  }

  return {
    id: "reveal-analytics",
    init: () => {
      if (config.optOut) setupOptOut();

      // Start tracking only if allowed
      addEventListeners();
      startTimers();

      if (config.debug) {
        console.log("Initialized reveal-analytics plugin");
        console.log("Plugin Config:", config);
        console.log("Tracking allowed:", optOutManager.isTrackingAllowed());
      }
    },
  };
};

export default Plugin;
