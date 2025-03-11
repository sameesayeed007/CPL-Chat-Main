describe('Profile Routes', () => {
    it('should create a new profile on POST /createProfile', async () => {
        const profileData = {
            userId: '123',
            username: 'testuser'
        };
        const res = await request(app).post('/createProfile').send(profileData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Profile has been created');
    });

    it('should show profile details on GET /showProfile/:userId', async () => {
        const res = await request(app).get('/showProfile/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Profile data is shown');
    });

    it('should update a profile on PUT /updateProfile/:id', async () => {
        const updateData = {
            fullName: 'Updated User'
        };
        const res = await request(app).put('/updateProfile/123').send(updateData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('profile has been updated');
    });

    it('should delete a profile on GET /deleteProfile/:profileId', async () => {
        const res = await request(app).get('/deleteProfile/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Profile has been deleted');
    });

    it('should search users on POST /searchUser', async () => {
        const searchData = {
            userId: '123',
            name: 'user'
        };
        const res = await request(app).post('/searchUser').send(searchData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('The users are shown as below');
    });
});
