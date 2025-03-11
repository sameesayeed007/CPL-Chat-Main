describe('Token Routes', () => {
    it('should validate the token on POST /validateToken', async () => {
        const tokenData = { token: 'valid-token' };
        const res = await request(app).post('/validateToken').send(tokenData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

