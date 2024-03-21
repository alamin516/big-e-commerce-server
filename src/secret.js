require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 5001;
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceDB2024";
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.jpg";
const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "JSIFJ4854HFSUIFVCSDO";

const jwtAccessKey = process.env.JWT_ACCESS_KEY || 'alamin'
const jwtRefreshTokenKey = process.env.JWT_REFRESH_TOKEN_KEY || 'alamin'
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'resetpasswordkey'

const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientUrl = process.env.CLIENT_URL || "";


module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  jwtAccessKey,
  smtpUserName,
  smtpPassword,
  clientUrl,
  jwtResetPasswordKey,
  jwtRefreshTokenKey
};
