const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Natours API',
    version: '1.0.0',
    description: 'Swagger documentation for Natours routes'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local development server' }
  ],
  tags: [
    { name: 'Tours', description: 'Tour operations' },
    { name: 'Users', description: 'User and auth operations' },
    { name: 'Reviews', description: 'Review operations' },
    { name: 'Courses', description: 'Course operations' },
    { name: 'Videos', description: 'Video operations' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Tour: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          duration: { type: 'integer' },
          difficulty: { type: 'string' },
          price: { type: 'number' }
        }
      },
      User: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      Review: {
        type: 'object',
        properties: {
          review: { type: 'string' },
          rating: { type: 'number' },
          tour: { type: 'string' }
        }
      },
      Course: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          instructor: { type: 'string' }
        }
      },
      Video: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          videoFile: { type: 'string' },
          duration: { type: 'number' },
          description: { type: 'string' },
          course: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/api/v1/tours': {
      get: {
        tags: ['Tours'],
        summary: 'Get all tours',
        responses: { '200': { description: 'List of tours' } }
      },
      post: {
        tags: ['Tours'],
        summary: 'Create a new tour',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Tour' }
            }
          }
        },
        responses: { '201': { description: 'Tour created' } }
      }
    },
    '/api/v1/tours/top_5_tours': {
      get: {
        tags: ['Tours'],
        summary: 'Get top 5 cheap tours',
        responses: { '200': { description: 'List of top 5 tours' } }
      }
    },
    '/api/v1/tours/tour-stats': {
      get: {
        tags: ['Tours'],
        summary: 'Get tour statistics',
        responses: { '200': { description: 'Tour statistics' } }
      }
    },
    '/api/v1/tours/{id}': {
      get: {
        tags: ['Tours'],
        summary: 'Get a tour by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'Tour details' } }
      },
      patch: {
        tags: ['Tours'],
        summary: 'Update a tour by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Tour' }
            }
          }
        },
        responses: { '200': { description: 'Tour updated' } }
      },
      delete: {
        tags: ['Tours'],
        summary: 'Delete a tour by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '204': { description: 'Tour deleted' } }
      }
    },
    '/api/v1/tours/{tourId}/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get reviews for a tour',
        parameters: [
          {
            name: 'tourId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of reviews' } }
      },
      post: {
        tags: ['Reviews'],
        summary: 'Create a review for a tour',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'tourId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' }
            }
          }
        },
        responses: { '201': { description: 'Review created' } }
      }
    },
    '/api/v1/users/signup': {
      post: {
        tags: ['Users'],
        summary: 'Sign up a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        responses: { '201': { description: 'User created' } }
      }
    },
    '/api/v1/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Log in a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Logged in successfully' } }
      }
    },
    '/api/v1/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User profile' } }
      }
    },
    '/api/v1/users/forgotPassword': {
      post: {
        tags: ['Users'],
        summary: 'Request password reset token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { email: { type: 'string', format: 'email' } }
              }
            }
          }
        },
        responses: { '200': { description: 'Password reset token sent' } }
      }
    },
    '/api/v1/users/resetPassword/{token}': {
      patch: {
        tags: ['Users'],
        summary: 'Reset password using token',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  password: { type: 'string' },
                  passwordConfirm: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Password reset' } }
      }
    },
    '/api/v1/users/updatePassword': {
      patch: {
        tags: ['Users'],
        summary: 'Update password for logged-in user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  passwordCurrent: { type: 'string' },
                  password: { type: 'string' },
                  passwordConfirm: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Password updated' } }
      }
    },
    '/api/v1/users/updateMe': {
      patch: {
        tags: ['Users'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'User updated' } }
      }
    },
    '/api/v1/users/deleteMe': {
      delete: {
        tags: ['Users'],
        summary: 'Deactivate current user',
        security: [{ bearerAuth: [] }],
        responses: { '204': { description: 'User deleted' } }
      }
    },
    '/api/v1/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'User data' } }
      },
      patch: {
        tags: ['Users'],
        summary: 'Update any user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        responses: { '200': { description: 'User updated' } }
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete any user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '204': { description: 'User deleted' } }
      }
    },
    '/api/v2/courses': {
      get: {
        tags: ['Courses'],
        summary: 'Get all courses',
        responses: { '200': { description: 'List of courses' } }
      }
    },
    '/api/v2/courses/addCourse': {
      post: {
        tags: ['Courses'],
        summary: 'Create a new course',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Course' }
            }
          }
        },
        responses: { '201': { description: 'Course created successfully' } }
      }
    },
    '/api/v2/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Get a course by ID with all videos',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'Course with videos' } }
      },
      patch: {
        tags: ['Courses'],
        summary: 'Update a course by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Course' }
            }
          }
        },
        responses: { '200': { description: 'Course updated' } }
      },
      delete: {
        tags: ['Courses'],
        summary: 'Delete a course by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '204': { description: 'Course deleted' } }
      }
    },////////////////////

'/api/v1/progress/{userId}/{courseId}': {
  get: {
    tags: ['Progress'],
    summary: 'Get user progress for a specific course',
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
      { name: 'courseId', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': { description: 'Progress retrieved successfully' },
      '404': { description: 'Progress not found' }
    }
  },
  patch: {
    tags: ['Progress'],
    summary: 'Update user progress for a video',
    security: [{ bearerAuth: [] }],
    parameters: [
      { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
      { name: 'courseId', in: 'path', required: true, schema: { type: 'string' } }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              videoId: { type: 'string' },
              isCompleted: { type: 'boolean' },
              progress:{type:'Number'}
            },
            required: ['videoId', 'isCompleted']
          }
        }
      }
    },
    responses: {
      '200': { description: 'Progress updated successfully' }
    }
  }
},

'/api/v1/progres/courses/{courseId}/coureseProgress': {
  get: {
    tags: ['Progress'],
    summary: 'Get course progress for current user',
    description: 'აბრუნებს კურსის სრულ პროგრესს: ჯამურ პროცენტს და ყველა ვიდეოს სტატუსს',
    security: [{ bearerAuth: [] }],
    parameters: [
      { 
        name: 'courseId', 
        in: 'path', 
        required: true, 
        schema: { type: 'string' },
        description: 'კურსის ID'
      }
    ],
    responses: {
      '200': { 
        description: 'Progress retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                data: {
                  type: 'object',
                  properties: {
                    totalVideos: { type: 'integer' },
                    percentage: { type: 'integer' },
                    videos: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          videoId: { type: 'string' },
                          title: { type: 'string' },
                          isCompleted: { type: 'boolean' },
                          progress: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '404': { description: 'Course or Progress not found' }
    }
  }
},

'/api/v1/progress/getAllCourses': {
  get: {
    tags: ['Progress'],
    summary: 'Get all enrolled courses progress',
    description: 'აბრუნებს იუზერის ყველა დარეგისტრირებული კურსის პროგრესს',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'Courses progress retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'success' },
                user: { type: 'string', example: '6a0d6a0e5a9497140bcacfd3' },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      courseId: { type: 'string' },
                      courseName: { type: 'string' },
                      percentage: { type: 'integer', example: 45 }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '401': { description: 'Unauthorized' }
    }
  }
},

'/api/v1/users/enroll': {
  patch: {
    tags: ['Users'],
    summary: 'Enroll a user to a course',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userId: { type: 'string', description: 'The ID of the user to enroll' },
              courseId: { type: 'string', description: 'The ID of the course' }
            },
            required: ['userId', 'courseId']
          }
        }
      }
    },
    responses: {
      '200': { description: 'User successfully enrolled' },
      '400': { description: 'Invalid data' },
      '401': { description: 'Unauthorized' },
      '403': { description: 'Forbidden - Managers only' },
      '404': { description: 'User or Course not found' }
    }
  }
},
//////////////


    '/api/v2/courses/{courseId}/videos': {
      get: {
        tags: ['Videos'],
        summary: 'Get all videos for a course',
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: { '200': { description: 'List of videos' } }
      },
      post: {
        tags: ['Videos'],
        summary: 'Add a video to a course',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Video' }
            }
          }
        },
        responses: { '201': { description: 'Video added successfully' } }
      }
    },
    '/api/v2/courses/{courseId}/videos/{id}': {
      get: {
        tags: ['Videos'],
        summary: 'Get a specific video',
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'Video details' } }
      },
      patch: {
        tags: ['Videos'],
        summary: 'Update a video',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Video' }
            }
          }
        },
        responses: { '200': { description: 'Video updated' } }
      },
      delete: {
        tags: ['Videos'],
        summary: 'Delete a video',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'courseId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { '204': { description: 'Video deleted' } }
      }
    }
  }
};

module.exports = swaggerSpec;
