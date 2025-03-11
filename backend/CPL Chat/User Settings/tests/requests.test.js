describe('Requests Routes', () => {
    it('should send a friend request on POST /sendRequest', async () => {
        const requestData = {
            userId: '123',
            username: 'user1',
            userIdTwo: '456',
            usernameTwo: 'user2'
        };
        const res = await request(app).post('/sendRequest').send(requestData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Request has been sent');
    });

    it('should show incoming requests on GET /showIncomingRequests/:userId', async () => {
        const res = await request(app).get('/showIncomingRequests/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('data is shown');
    });

    it('should show outgoing requests on GET /showOutgoingRequests/:userId', async () => {
        const res = await request(app).get('/showOutgoingRequests/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('data is shown');
    });

    it('should delete a request on GET /deleteRequest/:requestId', async () => {
        const res = await request(app).get('/deleteRequest/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Request has been deleted');
    });

    it('should add a friend on GET /addFriend/:requestId', async () => {
        const res = await request(app).get('/addFriend/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Friend has been added');
    });

    it('should reject a request on GET /rejectRequest/:requestId', async () => {
        const res = await request(app).get('/rejectRequest/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Friend has been rejected');
    });

    it('should remove a friend on POST /removeFriend', async () => {
        const res = await request(app).post('/removeFriend').send({ userId: '123', userIdTwo: '456' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('The friend has been removed');
    });
});
