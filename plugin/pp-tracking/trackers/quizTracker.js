import { QuizEventTypes } from "../constants";
import { Timer } from "../timer";
import { getSlideNumber } from "../utils";

/**
 * Tracks quiz interactions
 * @param {Object} config - The plugin configuration
 * @param {Array} logQuizActionEvents - Array to store quiz action events
 */
export const trackQuizzes = (config, logQuizActionEvents) => {
  if (!config.revealDependencies.quiz) return;

  const quizTimers = {};
  const quizConfig = Reveal.getConfig().quiz || {};
  quizConfig.events = quizConfig.events || {};

  const trackQuizStart = () => {
    const currentSlide = Reveal.getCurrentSlide();
    const quizElement = currentSlide.querySelector("[data-quiz]");

    if (!quizElement) return true;

    const quizName = quizElement.dataset.quiz;
    const quiz = window[quizName];

    if (!quiz) return true;

    if (quizTimers[quizName] instanceof Timer) {
      quizTimers[quizName].reset();
    } else {
      quizTimers[quizName] = new Timer();
      quizTimers[quizName].start();
    }

    const quizMetadata = {
      quizId: quizName,
      quizName: quiz.info.name,
      numberOfQuestions: quiz.questions.length,
      presentationId: config.apiConfig.presentationId,
      presentationUrl: window.location.href.replace(/(#(.+)?)/, ""),
    };

    logQuizActionEvents.push({
      timestamp: new Date().toISOString(),
      slideNumber: getSlideNumber(currentSlide),
      actionType: QuizEventTypes.START,
      ...quizMetadata,
    });

    return true;
  };

  const trackQuizComplete = (options) => {
    const currentSlide = Reveal.getCurrentSlide();
    const quizElement = currentSlide.querySelector("[data-quiz]");

    if (!quizElement) return true;

    const quizName = quizElement.dataset.quiz;
    const quiz = window[quizName];

    if (!quiz) return true;

    let dwellTime;
    if (quizTimers[quizName] instanceof Timer) {
      dwellTime = quizTimers[quizName].getTime();
      quizTimers[quizName].clear();
    }

    const quizMetadata = {
      quizId: quizName,
      quizName: quiz.info.name,
      numberOfQuestions: quiz.questions.length,
      presentationId: config.apiConfig.presentationId,
      presentationUrl: window.location.href.replace(/(#(.+)?)/, ""),
    };

    logQuizActionEvents.push({
      timestamp: new Date().toISOString(),
      actionType: QuizEventTypes.COMPLETE,
      slideNumber: getSlideNumber(currentSlide),
      dwellTime,
      completed: true,
      score: options.score,
      ...quizMetadata,
    });

    return true;
  };

  // Hook into quiz events
  if (quizConfig.events.onStartQuiz) {
    const existingCallback = quizConfig.events.onStartQuiz;
    quizConfig.events.onStartQuiz = () => {
      trackQuizStart();
      existingCallback();
    };
  } else {
    quizConfig.events.onStartQuiz = trackQuizStart;
  }

  if (quizConfig.events.onCompleteQuiz) {
    const existingCallback = quizConfig.events.onCompleteQuiz;
    quizConfig.events.onCompleteQuiz = (options) => {
      trackQuizComplete(options);
      existingCallback(options);
    };
  } else {
    quizConfig.events.onCompleteQuiz = trackQuizComplete;
  }

  // Initialize the quizzes
  if (typeof prepareQuizzes === "function") {
    prepareQuizzes(quizConfig);
  }
};
