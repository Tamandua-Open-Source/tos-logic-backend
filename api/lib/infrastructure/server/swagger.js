export default {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Timer Service API',
    description: 'Tamandua Open Source project',
  },

  tags: [
    {
      name: 'Timer',
    },
    {
      name: 'Timer Preferences',
    },
    {
      name: 'Service Subscription',
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
            description: 'Authentication Token Id',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              $ref: '#/definitions/Success Timer Response',
            },
          },
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              $ref: '#/definitions/Fail Timer Response',
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              $ref: '#/definitions/Success Timer Response',
            },
          },
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              $ref: '#/definitions/Fail Timer Response',
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              $ref: '#/definitions/Success Timer Response',
            },
          },
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              $ref: '#/definitions/Fail Timer Response',
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              $ref: '#/definitions/Success Timer Response',
            },
          },
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              $ref: '#/definitions/Fail Timer Response',
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              $ref: '#/definitions/Success Timer Response',
            },
          },
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              $ref: '#/definitions/Fail Timer Response',
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              $ref: '#/definitions/Success Timer Response',
            },
          },
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              $ref: '#/definitions/Fail Timer Response',
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              $ref: '#/definitions/Success Timer Response',
            },
          },
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              $ref: '#/definitions/Fail Timer Response',
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },

    //service subscription
    '/api/timer/preferences/subscribe/{userId}': {
      post: {
        tags: ['Service Subscription'],
        summary: 'Subscribe user to timer service with api key',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Timer Service Api Key',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'path',
            name: 'userId',
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
          202: {
            description: 'Accepted',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
    '/api/timer/preferences/unsubscribe/{userId}': {
      delete: {
        tags: ['Service Subscription'],
        summary: 'Unubscribe user from timer service with api key',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Timer Service Api Key',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'path',
            name: 'userId',
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
          202: {
            description: 'Accepted',
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
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
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
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
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
            description: 'Authentication Token Id',
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
                fcmToken: { type: 'string' },
                allowTimerNotifications: { type: 'boolean' },
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
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
    '/api/timer/preferences/subscribe': {
      post: {
        tags: ['Service Subscription'],
        summary: 'Subscribe user to timer service',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Authentication Token Id',
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
          202: {
            description: 'Accepted',
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
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
    '/api/timer/preferences/unsubscribe': {
      delete: {
        tags: ['Service Subscription'],
        summary: 'Unsubscribe user of timer service',
        parameters: [
          {
            in: 'header',
            name: 'authorization',
            description: 'Authentication Token Id',
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
          202: {
            description: 'Accepted',
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
          '4xx - 5xx': {
            description: 'Error',
            schema: {
              type: 'object',
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
  },

  definitions: {
    'Success Timer Response': {
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
        success: {
          type: 'boolean',
        },
      },
    },

    'Fail Timer Response': {
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
          },
        },
        success: {
          type: 'boolean',
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
            fcmToken: {
              type: 'string',
            },
            allowTimerNotifications: {
              type: 'boolean',
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

    Error: {
      type: 'object',
      properties: {
        errorCode: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
        errors: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        method: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
      },
    },
  },
}
