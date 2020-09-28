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
      description: 'API for timer logic',
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
  },
}
