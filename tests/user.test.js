const request = require("supertest")
const app = require('../src/app')
const User = require("../src/models/user")
const {userOneId , userOne , setupUser} = require("./fixtures/db")

beforeEach(setupUser)

test('should sign up' , async()=>{
    const response = await request(app).post('/users').send({
        name:"vinayak",
        email:"vinayak295@gmail.com",
        password:"Anurag123#"
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name:"vinayak",
            email:"vinayak295@gmail.com"
        },
        token:user.tokens[0].token
    })
})

test('should log in',async ()=>{
    const response = await request(app).post("/users/login").send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not log in if user doesnt exist', async()=>{
    await request(app).post("/users/login").send({
        email:"pawan@gmail.com",
        password:"pawan123#"
    }).expect(400)
})

test('Get profile for user',async()=>{
    await request(app)
    .get("/users/me")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test("should not get profile",async()=>{
    await request(app)
    .get("/users/me")
    .send()
    .expect(401)
})

test("should delete account",async()=>{
    await request(app)
    .delete("/users/me")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test("should not delete account",async()=>{
    await request(app)
    .delete("/users/me")
    .send()
    .expect(401)
})

test("Should check or avatar" , async ()=>{
    await request(app)
    .post("/users/me/avatar")
    .set("Authorization" , `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar" , "tests/fixtures/profile-pic.jpg")
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid feild", async()=>{
    await request(app)
    .patch("/users/me")
    .set("Authorization" , `Bearer ${userOne.tokens[0].token}`)
    .send({
        name:"mike"
    })
    .expect(200)
    const user= await User.findById(userOneId)
    expect(user.name).toBe("mike")
})

test("Should not update", async()=>{
    await request(app)
    .patch("/users/me")
    .send({
        name:"mike"
    })
    .expect(401)
})

test("Should not update", async()=>{
    await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        email:"anurag"
    })
    .expect(400)
})

test("Should not update valid feild", async()=>{
    await request(app)
    .patch("/users/me")
    .set("Authorization" , `Bearer ${userOne.tokens[0].token}`)
    .send({
        location:"mike"
    })
    .expect(400)
})

