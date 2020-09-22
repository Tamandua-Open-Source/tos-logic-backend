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
              properties: {
                message: {
                  type: 'string',
                },
                status: {
                  type: 'object',
                  properties: {
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
              properties: {
                message: {
                  type: 'string',
                },
                state: {
                  type: 'object',
                  properties: {
                    from: {
                      type: 'string',
                    },
                    to: {
                      type: 'string',
                    },
                    millisecondsToNextBreak: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/timer/finish': {
      post: {
        tags: ['Timer'],
        summary: 'Request INACTIVE state on timer',
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
              properties: {
                message: {
                  type: 'string',
                },
                state: {
                  type: 'object',
                  properties: {
                    from: {
                      type: 'string',
                    },
                    to: {
                      type: 'string',
                    },
                    millisecondsToStartCycle: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/timer/work': {
      post: {
        tags: ['Timer'],
        summary: 'Request WORK state on timer',
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
              properties: {
                message: {
                  type: 'string',
                },
                state: {
                  type: 'object',
                  properties: {
                    from: {
                      type: 'string',
                    },
                    to: {
                      type: 'string',
                    },
                    millisecondsToNextBreak: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/timer/break': {
      post: {
        tags: ['Timer'],
        summary: 'Request BREAK state on timer',
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
              properties: {
                message: {
                  type: 'string',
                },
                state: {
                  type: 'object',
                  properties: {
                    from: {
                      type: 'string',
                    },
                    to: {
                      type: 'string',
                    },
                    millisecondsToNextWork: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/timer/pause': {
      post: {
        tags: ['Timer'],
        summary: 'Request WORK state on timer',
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
              properties: {
                message: {
                  type: 'string',
                },
                state: {
                  type: 'object',
                  properties: {
                    from: {
                      type: 'string',
                    },
                    to: {
                      type: 'string',
                    },
                    millisecondsToPauseIdle: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/timer/resume': {
      post: {
        tags: ['Timer'],
        summary: 'Request WORK state on timer',
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
              properties: {
                message: {
                  type: 'string',
                },
                state: {
                  type: 'object',
                  properties: {
                    from: {
                      type: 'string',
                    },
                    to: {
                      type: 'string',
                    },
                    millisecondsToNextBreak: {
                      type: 'integer',
                    },
                    millisecondsToNextWork: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
