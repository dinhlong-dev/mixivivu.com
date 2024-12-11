// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Cấu hình Passport với Google Strategy
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'  // Đảm bảo trùng khớp với URI đã đăng ký trên Google Cloud
  },
  (accessToken, refreshToken, profile, done) => {
    // Logic xử lý khi xác thực thành công
    return done(null, profile);
  }
));

// Serialize và deserialize user (tùy chọn nếu dùng session)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
