# Reveal.js Analytics Plugin

This plugin allows you to track interactions with your reveal.js presentation.
It does not require setting persistent identifiers nor cookies, and it does not
collect any personal data. Based on the [reveal.js-tracking](https://github.com/pantajoe/reveal.js-tracking) plugin by Joe Pantazidis.

## Requirements

Supports reveal.js version > `4.0.0` (lower versions can work, but were not tested)

Requires the [revealjs-anayltics](https://github.com/ManhTin/revealjs-analytics)
application to receive the tracking events and display metrics.

## Installation

Download the `reveal-analytics.js` module from the plugin folder and add it to
the plugin folder of your reveal.js presentation.

## Initialize

Make sure you have created a presentation on the [revealjs-anayltics](https://github.com/ManhTin/revealjs-analytics) application and have the api `presentationId` ready. Then add the following configuration to your reveal.js presentation initialize. Only the apiConfig is required, the rest of the options are optional and can be adapted to your needs. See the reference below.

```js
Reveal.initialize({
  revealAnalytics: {
    apiConfig: {
      trackingAPI: "https://YOUR-DOMAIN.COM/api/v1/track_event",
      presentationId: "YOUR-PRESENTATION-ID"
    },
  },

 plugins: [RevealAnalytics],
});
```

## Configuration Options

| Option | Default Value | Description |
|--------|---------------|-------------|
| `apiConfig` | `{}` | Configuration for the tracking API endpoints |
| `dwellTimes` | `true` | Track how long users stay on each slide |
| `links` | `true` | Track interactions with links in the presentation |
| `media` | `true` | Track media interactions (play, pause, etc.) |
| `slideTransitions` | `true` | Track transitions between slides |
| `revealDependencies.quiz` | `false` | Enable tracking for the reveal.js quiz plugin |
| `optOut.popupDelay` | `1000` | Milliseconds to wait before showing the opt-out popup |
| `debug` | `false` | Enable debug mode for additional console output |

## Tracking Quiz Interactions
This plugin supports tracking of quiz interactions for the [reveal.js-quiz](https://gitlab.com/schaepermeier/reveal.js-quiz) plugin by Lennart Schäpermeier. Add it accordingly to the instructions. Then enable tracking for quiz interactions for this plugin, set the `revealDependencies.quiz` option to `true`.

```js
Reveal.initialize({
  revealAnalytics: {
    apiConfig: {
      // ...
    },
    revealDependencies: {
      quiz: true
    }
  },
});
```

## License
MIT licensed

Copyright (c) 2025 Manh Tin Nguyen
