'use strict';

/**
 * @module Indicator
 * @name Indicator
 * @description A representation of measure that is used to assess need,
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
const { sortedUniq } = require('@lykmapipo/common');
const { getString, getStrings } = require('@lykmapipo/env');
const {
  SCHEMA_OPTIONS,
  Schema,
  SchemaTypes,
  model,
  copyInstance,
} = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');
const randomColor = require('randomcolor');
const { ObjectId } = SchemaTypes;

/* subjects */
const SUBJECTS = sortedUniq(
  getStrings('ASSESSMENT_INDICATOR_SUBJECTS', [
    'Population',
    'Geography',
    'Health',
    'Water',
    'Sanitation',
    'Food & Nutrition',
    'Shelter',
    'Livelihood',
    'Income',
    'Protection',
    'Education',
    'Basic Needs',
    'Transportation',
    'Communication',
    'Energy',
  ])
);

/* schema options */
const POPULATION_MAX_DEPTH = 1;
const MODEL_NAME = getString('MODEL_NAME', 'Indicator');
const COLLECTION_NAME = getString('COLLECTION_NAME', 'indicators');
const OPTION_AUTOPOPULATE = {
  select: { subject: 1, topic: 1, color: 1 },
  maxDepth: POPULATION_MAX_DEPTH,
};

/**
 * @name IndicatorSchema
 * @type {Schema}
 * @since 1.0.0
 * @version 0.1.0
 * @private
 */
const IndicatorSchema = new Schema(
  {
    /**
     * @name base
     * @description Top(generic or main) indicator under which specific
     * indicator(s) is derived.
     *
     * If not set the indicator will be treated as generic and will be
     * affected by any logics implemented accordingly.
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
    base: {
      type: ObjectId,
      ref: MODEL_NAME,
      index: true,
      exists: true,
      autopopulate: OPTION_AUTOPOPULATE,
      taggable: true,
    },

    /**
     * @name subject
     * @description Human readable subject of an indicator(s).
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
     * Water
     */
    subject: {
      type: String,
      trim: true,
      required: true,
      enum: SUBJECTS,
      index: true,
      searchable: true,
      taggable: true,
      fake: true,
    },

    /**
     * @name topic
     * @description Human readable topic of an indicator(s).
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
     * Water Supply
     */
    topic: {
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
     * @name description
     * @description A brief summary(definition) about an indicator if
     * available i.e additional details that clarify about an indicator.
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
    description: {
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
     * @name color
     * @description A color code(in hexadecimal format) used to differentiate
     * indicators visually.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} uppercase - force upper-casing
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     * @example
     * #20687C
     */
    color: {
      type: String,
      trim: true,
      uppercase: true,
      default: function() {
        return randomColor({ luminosity: 'light' });
      },
      fake: true,
    },

    /**
     * @name icon
     * @description An icon(in url, base64, svg formats) used to differentiate
     * indicators visually.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} default - default value set when none provided
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    icon: {
      type: String,
      trim: true,
    },
  },
  SCHEMA_OPTIONS
);

/*
 *------------------------------------------------------------------------------
 * Indexes
 *------------------------------------------------------------------------------
 */

const uniqueIndex = { subject: 1, topic: 1 };
IndicatorSchema.index(uniqueIndex, { unique: true });

/*
 *------------------------------------------------------------------------------
 * Hook
 *------------------------------------------------------------------------------
 */

IndicatorSchema.pre('validate', function preValidate(next) {
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
 * @description indicator schema pre validation hook logic
 * @param {function} done callback to invoke on success or error
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 */
IndicatorSchema.methods.preValidate = function preValidate(done) {
  // ensure color
  if (_.isEmpty(this.color)) {
    this.color = randomColor({ luminosity: 'light' });
  }

  // continue
  return done();
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* constants */
IndicatorSchema.statics.MODEL_NAME = MODEL_NAME;
IndicatorSchema.statics.COLLECTION_NAME = COLLECTION_NAME;
IndicatorSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;
IndicatorSchema.statics.POPULATION_MAX_DEPTH = POPULATION_MAX_DEPTH;
IndicatorSchema.statics.SUBJECTS = SUBJECTS;

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description prepare indicators seeding upsert criteria
 * @param {Object} seed plain object indicators seed
 * @return {Object} criteria used to upsert indicators
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @public
 */
IndicatorSchema.statics.prepareSeedCriteria = seed => {
  // prepare incidenttype upsert criteria by _id or fields
  let criteria = copyInstance(seed);
  criteria = (
    criteria._id ?
     _.pick(criteria, '_id') : 
     _.pick(criteria, 'subject', 'topic')
  );
  // return indicators upsert criteria
  return criteria;
};

/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */

/* plug mongoose rest actions */
IndicatorSchema.plugin(actions);

/* export indicator model */
exports = module.exports = model(MODEL_NAME, IndicatorSchema);
