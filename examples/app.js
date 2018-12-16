'use strict';


/* ensure mongo uri */
process.env.MONGODB_URI =
  (process.env.MONGODB_URI || 'mongodb://localhost/emis-questionnaire');


/* dependencies */
const path = require('path');
const _ = require('lodash');
const { waterfall } = require('async');
const { include } = require('@lykmapipo/include');
const { connect } = require('@lykmapipo/mongoose-common')
const { Indicator, Question, Questionnaire } = include(__dirname, '..');
const { apiVersion, info, app } = include(__dirname, '..');


//seed
const clearQuestionnaires = (next) => Questionnaire.deleteMany(() => next());
const clearQuestions = (next) => Question.deleteMany(() => next());
const clearIndicators = (next) => Indicator.deleteMany(() => next());
const seedIndicators = (next) => {
  const indicators = Indicator.fake(5);
  Indicator.seed(indicators, next);
};
const seedQuestions = (indicators, next) => {
  let questions = Question.fake(indicators.length);
  questions = _.map(questions, (question, index) => {
    questions[index].indicator = indicators[index];
    return question;
  });
  Question.seed(questions, next);
};
const seedQuestionnaires = (questions, next) => {
  const questionnaire = Questionnaire.fake();
  questionnaire.questions = [...questions];
  Questionnaire.seed(questionnaire, next);
};


// establish mongodb connection
connect((error) => {

  // seed features
  waterfall([
    clearQuestionnaires, clearQuestions, clearIndicators,
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
