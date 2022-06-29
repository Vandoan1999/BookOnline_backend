import { request } from "./helpers";
import { faker } from "@faker-js/faker";
import { AppDataSource } from "../src/config/db";
import { get } from "../src/index";
describe("start", () => {
  let accessToken = "";
  let list_user: any[] = [];

  beforeAll(async () => {
    return await AppDataSource.initialize();
  });

  afterAll(async () => {});

  for (let i = 0; i < 25; i++) {
    test("register users", async () => {
      const fake_data = {
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: "12345678",
        role: "user",
        sex: Math.random() > 0.5 ? 1 : 0,
        image: faker.image.avatar(),
        address: faker.address.city(),
        phone: faker.phone.number("+84 01 ### ## ##"),
        bank: faker.finance.routingNumber(),
      };

      const { body: data } = await request.post(`/api/auth/register`).send(fake_data);
      expect(data.type).toBe("success");
    });
  }

  test("login admin", async () => {
    const { body: data } = await request.post(`/api/auth/login`).send({
      username: "admin",
      password: "12345678",
    });
    accessToken = data.data.accessToken;
    expect(data.type).toBe("success");
  });

  test("get list user", async () => {
    const { body: data } = await request.get(`/api/users`).set("Authorization", `Bear ${accessToken}`);
    list_user = data.data;
    expect(data.type).toBe("success");
    expect(data.data.length).toBeGreaterThan(19);
  });

  test("get detail user", async () => {
    const { body: data } = await request.get(`/api/users/${list_user[0].id}`).set("Authorization", `Bear ${accessToken}`);
    expect(data.type).toBe("success");
    expect(data.data.id).toBe(list_user[0].id);
  });

  test("update user", async () => {
    const fake_data = {
      id: list_user[0].id,
      email: faker.internet.email(),
      sex: Math.random() > 0.5 ? 1 : 0,
      image: faker.image.avatar(),
      address: faker.address.city(),
      phone: faker.phone.number("+84 01 ### ## ##"),
      bank: faker.finance.routingNumber(),
    };
    const { body: data } = await request.put(`/api/users`).send(fake_data).set("Authorization", `Bear ${accessToken}`);

    expect(data.type).toBe("success");
  });

  test("delete user", async () => {
    const { body: data } = await request.delete(`/api/users/${list_user[1].id}`).set("Authorization", `Bear ${accessToken}`);
    expect(data.type).toBe("success");
  });
});
