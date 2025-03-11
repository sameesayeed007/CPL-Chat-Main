describe('Token Verification Middleware', () => {
    it('should deny access if no token is provided', async () => {
        const res = await request(app).get('/test');
        expect(res.status).toBe(401);
        expect(res.text).toBe('Access Denied');
    });

    it('should deny access if token is invalid', async () => {
        const res = await request(app).get('/test').set('auth-token', 'invalid-token');
        expect(res.status).toBe(401);
        expect(res.text).toBe('Access Denied or the token has become expired');
    });

    it('should allow access if the token is valid', async () => {
        const res = await request(app).get('/test').set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'kaaj kortese' });
    });
});
