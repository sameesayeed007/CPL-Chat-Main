describe('One-to-One Room Routes', () => {
    it('should create a new one-to-one room on POST /createOnetoOneRoom', async () => {
        const roomData = {
            userIdOne: '123',
            usernameOne: 'userOne',
            userIdTwo: '456',
            usernameTwo: 'userTwo'
        };
        const res = await request(app).post('/createOnetoOneRoom').send(roomData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Room has been created');
    });

    it('should retrieve an existing room if it already exists on POST /createOnetoOneRoom', async () => {
        const roomData = {
            userIdOne: '123',
            usernameOne: 'userOne',
            userIdTwo: '456',
            usernameTwo: 'userTwo'
        };
        const res = await request(app).post('/createOnetoOneRoom').send(roomData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Room data is shown');
    });
});
