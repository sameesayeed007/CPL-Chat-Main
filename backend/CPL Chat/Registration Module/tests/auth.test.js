const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('Auth Routes', () => {
    it('should render the home page on GET /home', async () => {
        const res = await request(app).get('/home');
        expect(res.status).toBe(200);
    });

    it('should render the signup page on GET /signup_page', async () => {
        const res = await request(app).get('/signup_page');
        expect(res.status).toBe(200);
    });

    it('should render the forgot password page on GET /forgot_password', async () => {
        const res = await request(app).get('/forgot_password');
        expect(res.status).toBe(200);
    });

    it('should register a new user on POST /register', async () => {
        const user = { username: 'testuser', email: 'test@example.com', password: 'password123' };
        const res = await request(app).post('/register').send(user);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should login the user on POST /login', async () => {
        const loginData = { email: 'test@example.com', password: 'password123' };
        const res = await request(app).post('/login').send(loginData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should verify the user on GET /verify/:userId', async () => {
        const res = await request(app).get('/verify/123456');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should change the password on POST /changePassword', async () => {
        const passwordData = { email: 'test@example.com', password: 'oldpassword', newPassword: 'newpassword123' };
        const res = await request(app).post('/changePassword').send(passwordData).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should send OTP for forgotten password on POST /forgotPassword', async () => {
        const res = await request(app).post('/forgotPassword').send({ email: 'test@example.com' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should verify OTP on POST /verifyOtp', async () => {
        const otpData = { email: 'test@example.com', otp: '123456' };
        const res = await request(app).post('/verifyOtp').send(otpData).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
