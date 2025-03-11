const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('Group Routes', () => {
    it('should create a new group on POST /createGroup', async () => {
        const groupData = {
            userId: '123',
            username: 'testuser',
            groupName: 'Test Group',
            members: []
        };
        const res = await request(app).post('/createGroup').send(groupData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Group has been created');
    });

    it('should show all groups for a user on GET /showGroups/:userId', async () => {
        const res = await request(app).get('/showGroups/123');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should add a user to a group on PUT /addPeople/:groupId', async () => {
        const addData = {
            userId: '123',
            username: 'testuser',
            userIdTwo: '456',
            usernameTwo: 'newuser'
        };
        const res = await request(app).put('/addPeople/789').send(addData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Member has been added.');
    });

    it('should update a group on PUT /updateGroup/:id', async () => {
        const updateData = {
            groupName: 'Updated Group'
        };
        const res = await request(app).put('/updateGroup/789').send(updateData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Group has been updated');
    });

    it('should remove a user from a group on PUT /removePeople/:groupId', async () => {
        const removeData = {
            userId: '123',
            username: 'testuser',
            userIdTwo: '456',
            usernameTwo: 'userToRemove'
        };
        const res = await request(app).put('/removePeople/789').send(removeData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Member has been removed.');
    });

    it('should allow a user to leave a group on PUT /leaveGroup/:id', async () => {
        const leaveData = {
            userId: '123',
            username: 'testuser'
        };
        const res = await request(app).put('/leaveGroup/789').send(leaveData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('The person has been removed from the group');
    });
});
