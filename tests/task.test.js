const request = require("supertest")
const app = require('../src/app')
const Task = require("../src/models/task")
const {userOneId , userOne ,taskThreeId, setupUser} = require("./fixtures/db")

beforeEach(setupUser)

test("Should make task for user", async()=>{
    const response = await request(app)
    .post("/tasks")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        description:"Buy Milk"
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test("Should get only task of 1 user",async()=>{
    const response = await request(app)
    .get("/tasks")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toBe(2)
})

test("Should not delete task from another account",async()=>{
    const response = await request(app)
    .delete("/tasks/"+taskThreeId)
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)
    const task = await Task.findById(taskThreeId)
    expect(task).not.toBeNull()
})