import { getSlideNumber, tracksDwellTimePerSlide } from "../utils";

/**
 * Tracks dwell time for each slide
 * @param {Object} config - The plugin configuration
 * @param {Array} logSlideViewEvents - Array to store slide view events
 * @param {Timer} slideTimer - Timer for tracking slide views
 */
export const trackDwellTimes = (config, logSlideViewEvents, slideTimer) => {
  if (!tracksDwellTimePerSlide(config)) return;

  Reveal.addEventListener("slidechanged", (event) => {
    if (!event.previousSlide) return;

    logSlideViewEvents.push({
      presentationId: config.apiConfig.presentationId,
      presentationUrl: window.location.href.replace(/(#(.+)?)/, ""),
      timestamp: new Date().toISOString(),
      slideNumber: getSlideNumber(event.previousSlide),
      dwellTime: slideTimer.getTime(),
    });

    slideTimer.reset();
    console.log("logSlideViewEvent:", logSlideViewEvents.slice(-1)[0]);
  });
};
