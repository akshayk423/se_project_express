const { Joi, celebrate } = require('celebrate');

const validator = require('validator');

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.base': 'Item Name must be a string',
      'string.empty': 'Item Name cannot be empty',
      'string.min': 'Item Name must be at least 2 characters long',
      'string.max': 'Item Name must be at most 30 characters long',
      'any.required': 'Item Name is required',
    }),
    weather: Joi.string().required().valid('hot', 'cold', 'warm').messages({
      'any.only': 'Weather must be one of the following: hot, cold, warm',
      'any.required': 'Weather is required',
    }),
    imageUrl: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Invalid URL format');
        }
        return value;
      })
      .messages({
        'string.base': 'Image URL must be a string',
        'string.empty': 'Image URL cannot be empty',
        'any.required': 'Image URL is required',
        'string.custom': 'Image URL must be a valid URL',
      }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 30 characters long',
      'any.required': 'Name is required',
    }),
    avatar: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error('Invalid URL format');
        }
        return value;
      })
      .messages({
        'string.base': 'Avatar URL must be a string',
        'string.empty': 'Avatar URL cannot be empty',
        'any.required': 'Avatar URL is required',
        'string.custom': 'Avatar URL must be a valid URL',
      }),
    email: Joi.string().required().email().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
      'string.custom': 'Email must be a valid email address',
    }),
    password: Joi.string().required().min(6).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
      'string.custom': 'Password must be at least 6 characters long',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().min(6).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      'string.base': 'ID must be a string',
      'string.empty': 'ID cannot be empty',
      'string.hex': 'ID must be a hexadecimal string',
      'string.length': 'ID must be exactly 24 characters long',
      'any.required': 'ID is required',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUser,
  validateLogin,
  validateId,
};
