import { REVEAL_READY_EVENT } from "../constants";
import { getSlideNumber } from "../utils";

/**
 * Tracks Presentation start
 * @param {Object} config - The plugin configuration
 * @param {Array} logPresentationStartEvents - Array to store link action events
 */
export const trackStart = (config, logPresentationStartEvents) => {
  Reveal.on(REVEAL_READY_EVENT, (event) => {
    const currentSlide = Reveal.getCurrentSlide();

    logPresentationStartEvents.push({
      presentationId: config.apiConfig.presentationId,
      presentationUrl: window.location.href.replace(/(#(.+)?)/, ""),
      timestamp: new Date().toISOString(),
      slideNumber: getSlideNumber(currentSlide),
    });
    console.log(
      "logPresentationStartEvent:",
      logPresentationStartEvents.slice(-1)[0],
    );
  });
};
