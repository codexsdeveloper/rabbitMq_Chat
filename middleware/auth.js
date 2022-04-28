const jwt = require('jsonwebtoken')
const config = process.env;

const VerifyToken = (token) => {
    console.log("Token==============", token);

    if(!token) return {error: 'Unauthorised Access'}

    try {
        const user = jwt.verify(token, process.env.TOKEN_KEY)
        return user
    } catch (error) {
        console.log(error);
        return {error: 'Unauthorised Access'}
    }
}

module.exports = VerifyToken;