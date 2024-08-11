const env = {
    BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT) || 2,
}
module.exports = env;