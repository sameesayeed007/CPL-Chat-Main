describe('Token Verification Middleware', () => {
    it('should deny access if no token is provided', async () => {
        const res = await request(app).get('/some-protected-route');
        expect(res.status).toBe(401);
        expect(res.text).toBe('Access Denied');
    });

    it('should deny access if token is invalid', async () => {
        const res = await request(app).get('/some-protected-route').set('auth-token', 'invalid-token');
        expect(res.status).toBe(401);
        expect(res.text).toBe('Access Denied');
    });

    it('should allow access if the token is valid', async () => {
        const res = await request(app).get('/some-protected-route').set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
    });
});
