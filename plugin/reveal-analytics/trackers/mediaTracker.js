import { MediaEventTypes, MediaTypes } from "../constants";
import {
  getSlideNumber,
  getTrackableMedia,
  tracksAudio,
  tracksVideo,
} from "../utils";

/**
 * Tracks audio and video interactions
 * @param {Object} config - The plugin configuration
 * @param {Array} logMediaActionEvents - Array to store media action events
 */
export const trackMediaActions = (config, logMediaActionEvents) => {
  if (!tracksAudio(config) && !tracksVideo(config)) return;

  const setupMediaTracking = () => {
    const mediaElements = getTrackableMedia(config);

    for (const media of mediaElements) {
      const mediaMetadata = {
        mediaId: media.id,
        mediaType:
          media.tagName === "AUDIO" ? MediaTypes.AUDIO : MediaTypes.VIDEO,
        presentationId: config.apiConfig.presentationId,
        presentationUrl: window.location.href.replace(/(#(.+)?)/, ""),
      };

      if (!media.onplay) {
        media.onplay = function onPlay() {
          const currentSlide = Reveal.getCurrentSlide();
          const slideNumber = getSlideNumber(currentSlide);
          logMediaActionEvents.push({
            timestamp: new Date().toISOString(),
            actionType: MediaEventTypes.PLAY,
            slideNumber: slideNumber,
            mediaSource: this.currentSrc,
            currentTime: Number.parseInt(this.currentTime, 10),
            totalDuration: Number.parseInt(this.duration, 10),
            ...mediaMetadata,
          });

          if (config.debug) {
            console.log("🚀 Media played:", logMediaActionEvents);
          }
        };
      }

      if (!media.onpause) {
        media.onpause = function onPause() {
          const currentSlide = Reveal.getCurrentSlide();
          const slideNumber = getSlideNumber(currentSlide);
          logMediaActionEvents.push({
            timestamp: new Date().toISOString(),
            actionType: MediaEventTypes.PAUSE,
            slideNumber: slideNumber,
            mediaSource: this.currentSrc,
            currentTime: Number.parseInt(this.currentTime, 10),
            totalDuration: Number.parseInt(this.duration, 10),
            progress: this.currentTime / this.duration,
            finished: this.ended,
            ...mediaMetadata,
          });
        };
      }
    }
  };

  // Setup media tracking on various events
  Reveal.addEventListener("ready", setupMediaTracking);
  Reveal.addEventListener("fragmentshown", setupMediaTracking);
  Reveal.addEventListener("fragmenthidden", setupMediaTracking);
  Reveal.addEventListener("slidechanged", setupMediaTracking);
};
