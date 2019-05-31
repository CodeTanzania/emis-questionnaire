'use strict';

/**
 * @apiDefine Questionnaire Questionnaire
 *
 * @apiDescription A representation of a set of questions that is used to
 * assess need, situation and characteristics of disaster(or emergency) event.
 *
 * @see {@link https://en.wikipedia.org/wiki/Disaster}
 * @see {@link https://www.med.or.jp/english/journal/pdf/2013_01/019_024.pdf}
 * @see {@link https://www.spherestandards.org/handbook/}
 * @see {@link https://www.unocha.org/es/media-centre/humanitarian-reports}
 * @see {@link http://xlsform.org/en/}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 1.0.0
 * @version 0.1.0
 * @public
 */

/**
 * @apiDefine Questionnaire
 * @apiSuccess {String} _id Unique questionnaire identifier
 * @apiSuccess {String} assess Human readable type of assessment a questionnaire
 * is used for.
 * @apiSuccess {String} stage Human readable stage underwhich a questionnaire is
 * used for assessment.
 * @apiSuccess {String} phase Disaster management phase under which a
 * questionnaire is used for assessment
 * @apiSuccess {String} type Human readable type of entry of a questionnaire.
 * @apiSuccess {String} titel Human readable title of the questionnaire
 * @apiSuccess {String} label Human readable label of a questionnaire.
 * @apiSuccess {String} [descriptions] A brief summary(definition) about a
 * questionnaire to provide additional details that clarify about a questionnaire.
 * @apiSuccess {Question[]} questions A set of questions belongs to a
 * questionnaire.
 * @apiSuccess {Date} createdAt Date when questionnaire was created.
 * @apiSuccess {Date} updatedAt Date when questionnaire was last updated.
 */

/**
 * @apiDefine Questionnaires
 * @apiSuccess {Object[]} data List of questionnaires
 * @apiSuccess {String} data._id Unique questionnaire identifier
 * @apiSuccess {String} data.assess Human readable type of assessment a
 * questionnaire is used for.
 * @apiSuccess {String} data.stage Human readable stage underwhich a
 * questionnaire is used for assessment.
 * @apiSuccess {String} data.phase Disaster management phase under which a
 * questionnaire is used for assessment
 * @apiSuccess {String} data.type Human readable type of entry of a
 * questionnaire.
 * @apiSuccess {String} data.titel Human readable title of the questionnaire
 * @apiSuccess {String} data.label Human readable label of a questionnaire.
 * @apiSuccess {String} [data.descriptions] A brief summary(definition) about a
 * questionnaire to provide additional details that clarify about a questionnaire.
 * @apiSuccess {Question[]} data.questions A set of questions belongs to a
 * questionnaire.
 * @apiSuccess {Date} createdAt Date when questionnaire was created.
 * @apiSuccess {Date} updatedAt Date when questionnaire was last updated.
 * @apiSuccess {Number} total Total number of questionnaire
 * @apiSuccess {Number} size Number of questionnaire returned
 * @apiSuccess {Number} limit Query limit used
 * @apiSuccess {Number} skip Query skip/offset used
 * @apiSuccess {Number} page Page number
 * @apiSuccess {Number} pages Total number of pages
 * @apiSuccess {Date} lastModified Date and time at which latest questionnaire
 * was last modified
 */

/**
 * @apiDefine QuestionnaireSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "_id": "5c07af709404b82c5efdb438",
 *   "assess": "Need",
 *   "stage": "During",
 *   "phase": "Response",
 *   "title": "Need Assessment",
 *   "questions": [
 *      {
 *        "_id": "5c0777154797997c9dae8d7c",
 *        "indicator":
 *        {
 *          "_id": "5c0777154797997c9dae8d72"
 *          "subject": "Water",
 *          "topic": "Water Supply",
 *        },
 *        "assess": "Need",
 *        "stage": "During",
 *        "phase": "Preparedness",
 *        "type": "text",
 *        "name": "water_supply_before",
 *        "label": "Was there water supply before the disaster?",
 *        "choices": [
 *         {
 *            "label": "Yes",
 *            "name": "yes"
 *          },
 *          {
 *            "label": "No",
 *            "name": "no"
 *          }
 *        ]
 *      }
 *    ]
 *  }
 */

/**
 * @apiDefine QuestionnairesSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "data": [
 *    {
 *      "_id": "5c07af709404b82c5efdb438",
 *      "assess": "Need",
 *      "stage": "During",
 *      "phase": "Response",
 *      "title": "Need Assessment",
 *      "questions": [
 *        {
 *          "_id": "5c0777154797997c9dae8d7c",
 *          "indicator":
 *          {
 *            "_id": "5c0777154797997c9dae8d72"
 *            "subject": "Water",
 *            "topic": "Water Supply",
 *          },
 *          "assess": "Need",
 *          "stage": "During",
 *          "phase": "Preparedness",
 *          "type": "text",
 *          "name": "water_supply_before",
 *          "label": "Was there water supply before the disaster?",
 *          "choices": [
 *          {
 *            "label": "Yes",
 *            "name": "yes"
 *          },
 *          {
 *            "label": "No",
 *            "name": "no"
 *          }]
 *        }]
 *     }
 *    ],
 *   "total": 10,
 *   "size": 2,
 *   "limit": 2,
 *   "skip": 0,
 *   "page": 1,
 *   "pages": 5,
 *   "lastModified": "2018-05-06T10:19:04.910Z"
 * }
 *
 */

/* dependencies */
const _ = require('lodash');
const { getString } = require('@lykmapipo/env');
const { include } = require('@lykmapipo/include');
const Router = require('@lykmapipo/express-common').Router;

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_LIST = '/questionnaires';
const PATH_SINGLE = '/questionnaires/:id';
const PATH_SCHEMA = '/questionnaires/schema/';

/* declarations */
const Questionnaire = include(__dirname, 'questionnaire.model');
const router = new Router({
  version: API_VERSION,
});

/**
 * @api {get} /questionnaires List Questionnaires
 * @apiVersion 1.0.0
 * @apiName GetQuestionnaires
 * @apiGroup Questionnaire
 * @apiDescription Returns a list of questionnaires
 * @apiUse RequestHeaders
 * @apiUse Questionnaires
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse QuestionnairesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_LIST, function getQuestionnaires(request, response, next) {
  // obtain request options
  const options = _.merge({}, request.mquery);

  Questionnaire.get(options, function onGetQuestionnaires(error, results) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(results);
    }
  });
});

/**
 * @api {get} /questionnaires/schema Get Questionnaires Schema
 * @apiVersion 1.0.0
 * @apiName GetQuestionnaireSchema
 * @apiGroup Questionnaire
 * @apiDescription Returns questionnaire json schema definition
 * @apiUse RequestHeaders
 */
router.get(PATH_SCHEMA, function getQuestionnaireSchema(request, response) {
  const schema = Questionnaire.jsonSchema();
  response.status(200);
  response.json(schema);
});

/**
 * @api {post} /questionnaires Create New Questionnaires
 * @apiVersion 1.0.0
 * @apiName PostQuestionnaire
 * @apiGroup Questionnaire
 * @apiDescription Create new questionnaire
 * @apiUse RequestHeaders
 * @apiUse Questionnaire
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse QuestionnaireSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(PATH_LIST, function postQuestionnaire(request, response, next) {
  // obtain request body
  const body = _.merge({}, request.body);

  Questionnaire.post(body, function onPostQuestionnaire(error, created) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(201);
      response.json(created);
    }
  });
});

/**
 * @api {get} /questionnaires/:id Get Existing Questionnaires
 * @apiVersion 1.0.0
 * @apiName GetQuestionnaire
 * @apiGroup Questionnaire
 * @apiDescription Get existing questionnaire
 * @apiUse RequestHeaders
 * @apiUse Questionnaire
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse QuestionnaireSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_SINGLE, function getQuestionnaire(request, response, next) {
  // obtain request options
  const options = _.merge({}, request.mquery);

  // obtain questionnaire id
  options._id = request.params.id;

  Questionnaire.getById(options, function onGetQuestionnaire(error, found) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(found);
    }
  });
});

/**
 * @api {patch} /questionnaires/:id Patch Existing Questionnaires
 * @apiVersion 1.0.0
 * @apiName PatchQuestionnaire
 * @apiGroup Questionnaire
 * @apiDescription Patch existing questionnaire
 * @apiUse RequestHeaders
 * @apiUse Questionnaire
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse QuestionnaireSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(PATH_SINGLE, function patchQuestionnaire(request, response, next) {
  // obtain questionnaire id
  const { id } = request.params;

  // obtain request body
  const patches = _.merge({}, request.body);

  Questionnaire.patch(id, patches, function onPatchQuestionnaire(
    error,
    patched
  ) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(patched);
    }
  });
});

/**
 * @api {put} /questionnaires/:id Put Existing Questionnaires
 * @apiVersion 1.0.0
 * @apiName PutQuestionnaire
 * @apiGroup Questionnaire
 * @apiDescription Put existing questionnaire
 * @apiUse RequestHeaders
 * @apiUse Questionnaire
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse QuestionnaireSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(PATH_SINGLE, function putQuestionnaire(request, response, next) {
  // obtain questionnaire id
  const { id } = request.params;

  // obtain request body
  const updates = _.merge({}, request.body);

  Questionnaire.put(id, updates, function onPutQuestionnaire(error, updated) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(updated);
    }
  });
});

/**
 * @api {delete} /questionnaires/:id Delete Existing Questionnaires
 * @apiVersion 1.0.0
 * @apiName DeleteQuestionnaire
 * @apiGroup Questionnaire
 * @apiDescription Delete existing questionnaire
 * @apiUse RequestHeaders
 * @apiUse Questionnaire
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse QuestionnaireSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(PATH_SINGLE, function deleteQuestionnaire(
  request,
  response,
  next
) {
  // obtain questionnaire id
  const { id } = request.params;

  Questionnaire.del(id, function onDeleteQuestionnaire(error, deleted) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(deleted);
    }
  });
});

/* expose questionnaire router */
exports = module.exports = router;
