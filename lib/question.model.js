'use strict';

/**
 * @module Question
 * @name Question
 * @description A representation of question that is used to assess need,
 * situation and characteristics of disaster(or emergency) event.
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

/* dependencies */
const _ = require('lodash');
const { getString, getStrings } = require('@lykmapipo/env');
const { include } = require('@lykmapipo/include');
const { SCHEMA_OPTIONS } = require('@lykmapipo/mongoose-common');
const { Schema, SchemaTypes } = require('@lykmapipo/mongoose-common');
const { model, copyInstance } = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');
const { ObjectId } = SchemaTypes;
const { Choice } = include(__dirname, 'common.schema');
const Indicator = include(__dirname, 'indicator.model');

/* constants */

/* types */
const DEFAULT_TYPE = 'text';
const TYPES = getStrings('ASSESSMENT_QUESTION_TYPES', [
  'integer',
  'decimal',
  'text',
  'select_one',
  'select_multiple',
  'geopoint',
  'geotrace',
  'geoshape',
  'date',
  'time',
  'dateTime',
  'image',
  'audio',
  'video',
  'file',
]);

/* assess */
const ASSESS_NEED = 'Need';
const ASSESS_SITUATION = 'Situation';
const DEFAULT_ASSESS = 'Other';
const ASSESS = getStrings('ASSESSMENT_ASSESS', [
  ASSESS_NEED,
  ASSESS_SITUATION,
  DEFAULT_ASSESS,
]);

/* stages */
const STAGE_BEFORE = 'Before';
const STAGE_DURING = 'During';
const STAGE_AFTER = 'After';
const DEFAULT_STAGE = 'Other';
const STAGES = getStrings('ASSESSMENT_STAGES', [
  STAGE_BEFORE,
  STAGE_DURING,
  STAGE_AFTER,
  DEFAULT_STAGE,
]);

/* phases */
const DEFAULT_PHASE = 'Response';
const PHASES = getStrings('DISASTER_PHASES', [
  'Mitigation',
  'Preparedness',
  'Response',
  'Recovery',
]);

/* schema options */
const POPULATION_MAX_DEPTH = 1;
const MODEL_NAME = getString('MODEL_NAME', 'Question');
const COLLECTION_NAME = getString('COLLECTION_NAME', 'questions');
const OPTION_AUTOPOPULATE = {
  select: { access: 1, stage: 1, phase: 1, label: 1, name: 1 },
  maxDepth: POPULATION_MAX_DEPTH,
};

/**
 * @name QuestionSchema
 * @type {Schema}
 * @since 1.0.0
 * @version 0.1.0
 * @private
 */
const QuestionSchema = new Schema(
  {
    /**
     * @name base
     * @description Indicator which a question assess.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {string} ref - referenced model(or collection)
     * @property {boolean} index - ensure database index
     * @property {boolean} exists - ensure ref exists before save
     * @property {object} autopopulate - auto population(eager loading) options
     * @property {boolean} taggable - allow field use for tagging
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * {
     *   _id: "5bcda2c073dd0700048fb846",
     *   "subject": "Water",
     *   "topic": "Water Supply"
     * }
     */
    indicator: {
      type: ObjectId,
      ref: Indicator.MODEL_NAME,
      required: true,
      index: true,
      exists: true,
      autopopulate: Indicator.OPTION_AUTOPOPULATE,
      taggable: true,
    },

    /**
     * @name assess
     * @description Human readable type of assessment a question is used for.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {string[]} enum - collection of allowed values
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * Need
     */
    assess: {
      type: String,
      trim: true,
      required: true,
      enum: ASSESS,
      index: true,
      searchable: true,
      taggable: true,
      default: DEFAULT_ASSESS,
      fake: true,
    },

    /**
     * @name stage
     * @description Human readable stage underwhich a question is used to assess
     * an indicator.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {string[]} enum - collection of allowed values
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * Before
     */
    stage: {
      type: String,
      trim: true,
      required: true,
      enum: STAGES,
      index: true,
      searchable: true,
      taggable: true,
      default: DEFAULT_STAGE,
      fake: true,
    },

    /**
     * @name phase
     * @description Disaster management phase under which a question is
     * applicable to assess an indicator.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {string[]} enum - collection of allowed values
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * Response
     */
    phase: {
      type: String,
      trim: true,
      required: true,
      enum: PHASES,
      index: true,
      searchable: true,
      taggable: true,
      default: DEFAULT_PHASE,
      fake: true,
    },

    /**
     * @name type
     * @description Human readable type of entry of a question.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {string[]} enum - collection of allowed values
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * text
     */
    type: {
      type: String,
      trim: true,
      required: true,
      enum: TYPES,
      index: true,
      searchable: true,
      taggable: true,
      default: DEFAULT_TYPE,
      fake: true,
    },

    /**
     * @name name
     * @description Unique variable name of a question.
     *
     * Used to distinguish response collected from one question to another to
     * aid data analysis and exploratory.
     *
     * Default algorithm is snake case of phase, indicator subject, assess, stage.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {boolean} taggable - allow field use for tagging
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * water_supply
     */
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
      searchable: true,
      taggable: true,
      fake: {
        generator: 'hacker',
        type: 'noun',
      },
    },

    /**
     * @name label
     * @description Human readable label of a question.
     *
     * It is the actual question respondent(s) get asked.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {boolean} taggable - allow field use for tagging
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * Was there water supply before the disaster?
     */
    label: {
      type: String,
      trim: true,
      required: true,
      index: true,
      searchable: true,
      taggable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

    /**
     * @name help
     * @description A brief additional details that clarify about a question.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    help: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

    /**
     * @name choices
     * @description A set of allowed choices(or selection options) of a question.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} default - default value set when none provided
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    choices: {
      type: [Choice],
      default: undefined,
    },
  },
  SCHEMA_OPTIONS
);

/*
 *------------------------------------------------------------------------------
 * Indexes
 *------------------------------------------------------------------------------
 */

const uniqueIndex = { name: 1 };
QuestionSchema.index(uniqueIndex, { unique: true });

/*
 *------------------------------------------------------------------------------
 * Hook
 *------------------------------------------------------------------------------
 */

QuestionSchema.pre('validate', function preValidate(next) {
  this.preValidate(next);
});

/*
 *------------------------------------------------------------------------------
 *  Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @function preValidate
 * @description question schema pre validation hook logic
 * @param {function} done callback to invoke on success or error
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 */
QuestionSchema.methods.preValidate = function preValidate(done) {
  // generate question name(variable)
  if (_.isEmpty(this.name)) {
    this.name = _.snakeCase(this.label);
  }

  // continue
  done();
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* constants */
QuestionSchema.statics.MODEL_NAME = MODEL_NAME;
QuestionSchema.statics.COLLECTION_NAME = COLLECTION_NAME;
QuestionSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;
QuestionSchema.statics.POPULATION_MAX_DEPTH = POPULATION_MAX_DEPTH;

QuestionSchema.statics.DEFAULT_ASSESS = DEFAULT_ASSESS;
QuestionSchema.statics.ASSESS = ASSESS;

QuestionSchema.statics.DEFAULT_TYPE = DEFAULT_TYPE;
QuestionSchema.statics.TYPES = TYPES;

QuestionSchema.statics.DEFAULT_STAGE = DEFAULT_STAGE;
QuestionSchema.statics.STAGES = STAGES;

QuestionSchema.statics.DEFAULT_PHASE = DEFAULT_PHASE;
QuestionSchema.statics.PHASES = PHASES;

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description prepare question seeding upsert criteria
 * @param {Object} seed plain object question seed
 * @return {Object} criteria used to upsert question
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @public
 */
QuestionSchema.statics.prepareSeedCriteria = seed => {
  // prepare question upsert criteria by _id or fields
  let criteria = copyInstance(seed);
  criteria = (
    criteria._id ?
     _.pick(criteria, '_id') : 
     _.pick(criteria, 'name')
  );
  // return question upsert criteria
  return criteria;
};


/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */

/* plug mongoose rest actions */
QuestionSchema.plugin(actions);

/* export question model */
exports = module.exports = model(MODEL_NAME, QuestionSchema);
