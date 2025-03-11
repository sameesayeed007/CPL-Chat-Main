describe('SocketInfo Routes', () => {
    it('should save socket info on POST /saveSocketInfo', async () => {
        const socketData = {
            userId: '123',
            socketId: 'abc123'
        };
        const res = await request(app).post('/saveSocketInfo').send(socketData).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Socket Info has been saved');
    });
});
