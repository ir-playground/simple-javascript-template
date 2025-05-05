const request = require('supertest');
const express = require('express');
const app = require('../server');

let server;

describe('Todo API', () => {
  beforeAll(() => {
    server = app.listen(0); // Use port 0 to let OS assign an available port
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    // Reset todos before each test
    app.locals.todos = [];
    app.locals.currentId = 1;
    // Also reset the server's internal todos array
    const appInstance = require('../server');
    appInstance.locals.todos = [];
  });

  afterEach(() => {
    // Ensure todos are cleared after each test
    app.locals.todos = [];
  });

  describe('GET /todos', () => {
    it('should return an empty array initially', async () => {
      const res = await request(app).get('/todos');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should return all todos', async () => {
      // Add test todos
      const todo1 = { title: 'Test Todo 1', completed: false };
      const todo2 = { title: 'Test Todo 2', completed: true };
      
      await request(app).post('/todos').send(todo1);
      await request(app).post('/todos').send(todo2);
      
      const res = await request(app).get('/todos');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const todo = { title: 'Test Todo', completed: false };
      const res = await request(app).post('/todos').send(todo);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toEqual(todo.title);
      expect(res.body.completed).toEqual(todo.completed);
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app).post('/todos').send({ completed: false });
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a todo by id', async () => {
      const todo = { title: 'Test Todo', completed: false };
      const postRes = await request(app).post('/todos').send(todo);
      const createdTodo = postRes.body;
      
      const res = await request(app).get(`/todos/${createdTodo.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(createdTodo);
    });

    it('should return 404 if todo not found', async () => {
      const res = await request(app).get('/todos/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo', async () => {
      const todo = { title: 'Test Todo', completed: false };
      const postRes = await request(app).post('/todos').send(todo);
      const createdTodo = postRes.body;
      
      const updates = { title: 'Updated Todo', completed: true };
      const res = await request(app)
        .put(`/todos/${createdTodo.id}`)
        .send(updates);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual(updates.title);
      expect(res.body.completed).toEqual(updates.completed);
    });

    it('should return 404 if todo not found', async () => {
      const res = await request(app).put('/todos/999').send({ title: 'Updated' });
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = { title: 'Test Todo', completed: false };
      const postRes = await request(app).post('/todos').send(todo);
      const createdTodo = postRes.body;
      
      const res = await request(app).delete(`/todos/${createdTodo.id}`);
      expect(res.statusCode).toEqual(204);
    });

    it('should return 404 if todo not found', async () => {
      const res = await request(app).delete('/todos/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });
});