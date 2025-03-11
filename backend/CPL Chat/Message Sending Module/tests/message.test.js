const request = require('supertest');
const app = require('../app'); // Import your app here

describe('Message Routes', () => {
    it('should return a success message on GET /test', async () => {
        const res = await request(app).get('/test').set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'kaaj kortese' });
    });

    it('should save a message on POST /saveMessages', async () => {
        const message = {
            userId: '123',
            content: 'Hello World',
            roomId: 'room1',
            username: 'user1'
        };
        const res = await request(app).post('/saveMessages').send(message).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Message has been saved');
    });

    it('should save a reply on POST /saveReplies', async () => {
        const reply = {
            userId: '123',
            content: 'Reply to message',
            roomId: 'room1',
            username: 'user1',
            messageId: 'message123',
            messageContent: 'Original message'
        };
        const res = await request(app).post('/saveReplies').send(reply).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Message has been saved');
    });

    it('should update a message on POST /updateMessages', async () => {
        const updateData = {
            messageId: 'message123',
            isSeen: true
        };
        const res = await request(app).post('/updateMessages').send(updateData).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Message has been updated');
    });

    it('should delete a message on POST /deleteMessages', async () => {
        const deleteData = {
            messageId: 'message123'
        };
        const res = await request(app).post('/deleteMessages').send(deleteData).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Message has been deleted');
    });

    it('should un-send a message on POST /unsendMessages', async () => {
        const unsendData = {
            messageId: 'message123'
        };
        const res = await request(app).post('/unsendMessages').send(unsendData).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Message has been unsent');
    });

    it('should get messages on GET /getMessages', async () => {
        const res = await request(app).get('/getMessages').query({ roomId: 'room1' }).set('auth-token', 'valid-token');
        expect(res.status).toBe(200);
        expect(res.body.messages).toBeDefined();
    });
});
