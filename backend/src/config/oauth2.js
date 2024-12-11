const { google } = require('googleapis');

// Tạo OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI_DEV
);

// Thiết lập refresh_token
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// Hàm lấy access_token
const getAccessToken = async () => {
    try {
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        return accessTokenResponse.token; // Trả về access_token
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};

module.exports = { getAccessToken };
