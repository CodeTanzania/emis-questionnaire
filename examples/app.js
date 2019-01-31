'use strict';


/* dependencies */
const path = require('path');
const _ = require('lodash');
const { waterfall } = require('async');
const { include } = require('@lykmapipo/include');
const { connect } = require('@lykmapipo/mongoose-common')
const { Indicator, Question, Questionnaire } = include(__dirname, '..');
const { apiVersion, info, app } = include(__dirname, '..');


// seeds
const seedIndicators = (next) => Indicator.seed((error) => next(error));
const seedQuestions = (next) => Question.seed((error) => next(error));
const seedQuestionnaires = (next) => Questionnaire.seed((error) => next(error));


// establish mongodb connection
connect((error) => {

  // seed features
  waterfall([
    seedIndicators, seedQuestions, seedQuestionnaires
  ], (error, results) => {

    // expose module info
    app.get('/', (request, response) => {
      response.status(200);
      response.json(info);
    });

    // fire the app
    app.start((error, env) => {
      console.log(`visit http://0.0.0.0:${env.PORT}`);
    });

  });

});
