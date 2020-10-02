export default {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'TOS logic server',
    description: 'Tamandua Open Source project',
  },

  tags: [
    {
      name: 'Timer',
      description: 'API for timer service',
    },
    {
      name: 'Timer Preferences',
      description: 'API for timer service preferences',
    },
  ],

  schemes: ['https', 'http'],
  consumes: ['application/json'],
  produces: ['application/json'],

  paths: {
    '/api/timer/status': {
      get: {
        tags: ['Timer'],
        summary: 'Request timer status',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Response',
            },
          },
        },
      },
    },
    '/api/timer/start': {
      post: {
        tags: ['Timer'],
        summary: 'Request timer to start',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Response',
            },
          },
        },
      },
    },
    '/api/timer/finish': {
      post: {
        tags: ['Timer'],
        summary: 'Request timer to finish',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Response',
            },
          },
        },
      },
    },
    '/api/timer/work': {
      post: {
        tags: ['Timer'],
        summary: 'Request timer to work',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Response',
            },
          },
        },
      },
    },
    '/api/timer/break': {
      post: {
        tags: ['Timer'],
        summary: 'Request timer to break',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Response',
            },
          },
        },
      },
    },
    '/api/timer/pause': {
      post: {
        tags: ['Timer'],
        summary: 'Request timer to pause',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Response',
            },
          },
        },
      },
    },
    '/api/timer/resume': {
      post: {
        tags: ['Timer'],
        summary: 'Request timer to resume',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Response',
            },
          },
        },
      },
    },

    '/api/timer/preferences': {
      get: {
        tags: ['Timer Preferences'],
        summary: 'Get timer preferences',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Preferences',
            },
          },
        },
      },
      patch: {
        tags: ['Timer Preferences'],
        summary: 'Patch timer preferences',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
          {
            in: 'body',
            name: 'info',
            description: 'Info to be patched',
            required: false,
            schema: {
              type: 'object',
              properties: {
                startTime: { type: 'string' },
                breakDuration: { type: 'integer' },
                breakLimitDuration: { type: 'integer' },
                breakIdleLimitDuration: { type: 'integer' },
                workDuration: { type: 'integer' },
                workLimitDuration: { type: 'integer' },
                workIdleLimitDuration: { type: 'integer' },
                pauseLimitDuration: { type: 'integer' },
                pauseIdleLimitDuration: { type: 'integer' },
              },
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Preferences',
            },
          },
        },
      },
    },

    '/api/timer/preferences/subscribe': {
      post: {
        tags: ['Timer Preferences'],
        summary: 'Subscribe user to timer service',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              $ref: '#/definitions/Timer Preferences',
            },
          },
        },
      },
    },

    '/api/timer/preferences/unsubscribe': {
      delete: {
        tags: ['Timer Preferences'],
        summary: 'Unsubscribe user of timer service',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Token used to authenticate the user',
            required: false,
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                UserId: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },

  definitions: {
    'Timer Response': {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        status: {
          type: 'object',
          properties: {
            lastState: {
              type: 'string',
            },
            currentState: {
              type: 'string',
            },
            millisecondsToStartCycle: {
              type: 'integer',
            },
            millisecondsToNextBreak: {
              type: 'integer',
            },
            millisecondsToNextWork: {
              type: 'integer',
            },
            millisecondsToBreakIdle: {
              type: 'integer',
            },
            millisecondsToWorkIdle: {
              type: 'integer',
            },
            millisecondsToPauseIdle: {
              type: 'integer',
            },
            millisecondsToInactive: {
              type: 'integer',
            },
          },
        },
      },
    },

    'Timer Preferences': {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        preferences: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            UserId: {
              type: 'string',
            },
            startTime: {
              type: 'string',
            },
            breakDuration: {
              type: 'integer',
            },
            breakLimitDuration: {
              type: 'integer',
            },
            breakIdleLimitDuration: {
              type: 'integer',
            },
            lastBreakStartTime: {
              type: 'string',
            },
            workDuration: {
              type: 'integer',
            },
            workLimitDuration: {
              type: 'integer',
            },
            workIdleLimitDuration: {
              type: 'integer',
            },
            lastWorkStartTime: {
              type: 'string',
            },
            pauseLimitDuration: {
              type: 'integer',
            },
            pauseIdleLimitDuration: {
              type: 'integer',
            },
            lastPauseStartTime: {
              type: 'string',
            },
            currentState: {
              type: 'string',
            },
            lastState: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
            },
            updatedAt: {
              type: 'string',
            },
          },
        },
      },
    },
  },
}
