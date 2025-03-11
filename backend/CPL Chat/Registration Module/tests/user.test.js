describe('User Routes', () => {
    it('should set the user status to online on POST /makeOnline', async () => {
        const res = await request(app).post('/makeOnline').send({ userId: '123456' }).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should set the user status to offline on POST /makeOffline', async () => {
        const res = await request(app).post('/makeOffline').send({ userId: '123456' }).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should get the username of the user on GET /getUsername/:userId', async () => {
        const res = await request(app).get('/getUsername/123456').set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
    });
});
