import * as Joi from 'joi';

export default Joi.object({
  /* PORT APP */
  PORT: Joi.number().required(),
  SELF_WEB_URL: Joi.required(),
  ACCESS_TOKEN_SECRET: Joi.required(),
  ACCESS_TOKEN_EXPIRATION: Joi.required(),
  REFRESH_TOKEN_SECRET: Joi.required(),
  REFRESH_TOKEN_EXPIRATION: Joi.required(),

  /* DATABASE INFORMATION */
  DATABASE_CLIENT: Joi.required(),
  DATABASE_HOST: Joi.required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.required(),
  DATABASE_PASSWORD: Joi.required(),
  DATABASE_NAME: Joi.required(),

  /* CLOUDINARY */
  CLOUDINARY_CLOUD_NAME: Joi.required(),
  CLOUDINARY_API_KEY: Joi.required(),
  CLOUDINARY_API_SECRET: Joi.required(),

  /* MAILGUN */
  MAILGUN_DOMAIN: Joi.required(),
  MAILGUN_PRIVATE_KEY: Joi.required(),
  MAILGUN_EMAIL_FROM: Joi.required()
});
