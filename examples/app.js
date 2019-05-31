'use strict';

/* dependencies */
const _ = require('lodash');
const { waterfall } = require('async');
const { include } = require('@lykmapipo/include');
const { connect } = require('@lykmapipo/mongoose-common');
const { get, mount, start } = require('@lykmapipo/express-common');
const { Indicator, Question, Questionnaire } = include(__dirname, '..');
const { info, indicatorRouter, questionRouter, questionnaireRouter } = include(
  __dirname,
  '..'
);

// seeds
const seedIndicators = next => Indicator.seed(error => next(error));
const seedQuestions = next => Question.seed(error => next(error));
const seedQuestionnaires = next => Questionnaire.seed(error => next(error));

// establish mongodb connection
connect(error => {
  // re-throw if error
  if (error) {
    throw error;
  }

  // seed features
  waterfall(
    [seedIndicators, seedQuestions, seedQuestionnaires],
    (error, results) => {
      // re-throw if error
      if (error) {
        throw error;
      }

      // expose module info
      get('/', (request, response) => {
        response.status(200);
        response.json(info);
      });

      // mount routers
      mount(indicatorRouter, questionRouter, questionnaireRouter);

      // fire the app
      start((error, env) => {
        console.log(`visit http://0.0.0.0:${env.PORT}`);
      });
    }
  );
});
