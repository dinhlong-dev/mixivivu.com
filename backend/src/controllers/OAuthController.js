require('dotenv').config();
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const querystring = require('querystring');

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const OAuthController = {
    getAuthUrl: async (req, res) => {
        try {
            const scopes = [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ]

            const params = {
                client_id: process.env.CLIENT_ID,
                redirect_uri: process.env.REDIRECT_URI,
                response_type: 'token',
                scope: scopes.join(' '),
                include_granted_scopes: 'true',
                state: 'state_parameter_passthrough_value',
            };

            const authURL = `${AUTH_URL}?${querystring.stringify(params)}`;
            res.send({ authURL });

            // console.log(authURL);
        } catch (error) {
            res.status(500).json(error.message)
        }

    }

}


module.exports = OAuthController