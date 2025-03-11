const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('Notification Routes', () => {
    it('should create a notification on POST /createNotification', async () => {
        const notificationData = {
            userId: '123',
            username: 'testuser',
            fullName: 'Test User',
            profilePhoto: 'path/to/photo',
            address: '123 Street',
            phoneNumber: '123-456-7890'
        };
        const res = await request(app).post('/createNotification').send(notificationData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Notification has been created');
    });
});
