const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const secret = 'c5eb34c3-72bc-4de9-bf1b-221b8775d81a';
const expiration = '2h';

module.exports = {

    AuthenticationError: new GraphQLError('Could not authenticate user', {extensions: {code: 'UNATHENTICATED' } }),

    authMiddleware: function ({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;

        } catch {
            console.log('Invalid Token');
        }

        return req;

    },

    signToken: function({ username, email, _id }){
        const payload = {username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};