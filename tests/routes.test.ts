import { request } from "./helpers";
import { faker } from "@faker-js/faker";
import { AppDataSource } from "../src/config/db";
import { get } from "../src/server";
import { Server } from "http";
import { CreateBookRequest } from "../src/models/book/create-book.request";
import { UpdateBookRequest } from "../src/models/book/update-book.request";
import { differenceBy } from "lodash";
describe("start test", () => {
  let accessToken = "";
  let list_user: any[] = [];
  let list_supplier: any[] = [];
  let list_category: any[] = [];
  let list_book: any[] = [];
  let server: Server;

  beforeAll(async () => {
    server = get().listen(4000);
    return await AppDataSource.initialize();
  });

  afterAll(async () => {
    // await request.get("/api/test");
    server.close();
  });

  //auth controller
  describe("auth controller", () => {
    for (let i = 0; i < 25; i++) {
      test("register users", async () => {
        const fake_data = {
          username: faker.name.findName() + Math.floor(Math.random() * 100),
          email: faker.internet.email(),
          password: "12345678",
        };

        const { body: data } = await request
          .post(`/api/auth/register`)
          .send(fake_data);
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

    test("get profile user", async () => {
      const { body: data } = await request
        .get(`/api/auth/profile`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
    });
  });

  //user controller
  describe("user controller", () => {
    let user_to_be_delete;
    test("get list user", async () => {
      const { body: data } = await request
        .get(`/api/users`)
        .set("Authorization", `Bear ${accessToken}`);
      list_user = data.data;

      expect(data.type).toBe("success");
      expect(data.data.length).toBeGreaterThan(19);
      user_to_be_delete = list_user.pop();
    });

    test("get detail user", async () => {
      const { body: data } = await request
        .get(`/api/users/${user_to_be_delete.id}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.id).toBe(user_to_be_delete.id);
    });

    test("update user", async () => {
      const fake_data = {
        id: user_to_be_delete.id,
        email: faker.internet.email(),
        sex: Math.random() > 0.5 ? 1 : 0,
        image: faker.image.avatar(),
        address: faker.address.city(),
        phone: faker.phone.number("+84 01 ### ## ##"),
        bank: faker.finance.routingNumber(),
      };
      const { body: data } = await request
        .put(`/api/users`)
        .send(fake_data)
        .set("Authorization", `Bear ${accessToken}`);

      expect(data.type).toBe("success");
    });

    test("delete user", async () => {
      const { body: data } = await request
        .delete(`/api/users/${user_to_be_delete.id}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
    });
  });

  //supplier controller
  describe("supplier controller", () => {
    let supplier_to_be_delete;
    let list_supplier_to_be_delete;
    for (let i = 0; i < 25; i++) {
      test("create supplier", async () => {
        const fake_data = {
          address: faker.address.city(),
          phone: faker.phone.number("+84 01 ### ## ##"),
          company:
            faker.company.companyName() + Math.floor(Math.random() * 100),
        };
        const { body: data } = await request
          .post(`/api/suppliers`)
          .send(fake_data)
          .set("Authorization", `Bear ${accessToken}`);

        expect(data.type).toBe("success");
      });
    }

    test("list supplier greater than 19", async () => {
      const { body: data } = await request
        .get(`/api/suppliers`)
        .set("Authorization", `Bear ${accessToken}`);
      list_supplier = data.data;
      expect(data.type).toBe("success");
      expect(data.data.length).toBeGreaterThan(19);
      supplier_to_be_delete = list_supplier.pop();
      list_supplier_to_be_delete = list_supplier
        .splice(0, 5)
        .map((item) => item.id);
    });

    test("update supplier", async () => {
      const fake_data = {
        id: supplier_to_be_delete.id,
        address: faker.address.city(),
        phone: faker.phone.number("+84 01 ### ## ##"),
        company: faker.company.companyName() + Math.floor(Math.random() * 100),
      };
      const { body: data } = await request
        .put(`/api/suppliers`)
        .send(fake_data)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
    });

    test("detail supplier", async () => {
      const { body: data } = await request
        .get(`/api/suppliers/${supplier_to_be_delete.id}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.id).toBe(supplier_to_be_delete.id);
    });

    test("delete supplier", async () => {
      const { body: data } = await request
        .delete(`/api/suppliers/${supplier_to_be_delete.id}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.affected).toBe(1);
    });

    test("delete multiple supplier", async () => {
      const { body: data } = await request
        .delete(
          `/api/suppliers/multiple?ids=${list_supplier_to_be_delete.toString()}`
        )
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.supplier_deleted.length).toBeGreaterThan(0);
    });
  });

  //category
  describe("category controller", () => {
    let category_to_be_delete;
    for (let i = 0; i < 25; i++) {
      test("create category", async () => {
        const fake_data = {
          name: faker.commerce.product() + Math.floor(Math.random() * 100),
          image: faker.image.animals(),
        };
        const { body: data } = await request
          .post(`/api/categories`)
          .send(fake_data)
          .set("Authorization", `Bear ${accessToken}`);

        expect(data.type).toBe("success");
      });
    }

    test("list category greater than 19", async () => {
      const { body: data } = await request
        .get(`/api/categories`)
        .set("Authorization", `Bear ${accessToken}`);
      list_category = data.data;
      expect(data.type).toBe("success");
      expect(data.data.length).toBeGreaterThan(19);
      category_to_be_delete = list_category.pop();
    });

    test("update category", async () => {
      const fake_data = {
        id: category_to_be_delete.id,
        name: faker.commerce.product() + Math.floor(Math.random() * 100),
        image: faker.image.animals(),
      };
      const { body: data } = await request
        .put(`/api/categories`)
        .send(fake_data)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
    });

    test("detail category", async () => {
      const { body: data } = await request
        .get(`/api/categories/${category_to_be_delete.id}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.id).toBe(category_to_be_delete.id);
    });

    test("delete category", async () => {
      const { body: data } = await request
        .delete(`/api/categories/${category_to_be_delete.id}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.affected).toBe(1);
    });
  });

  describe("book controller", () => {
    let book_to_be_delete;
    let list_book_to_be_delete;
    for (let i = 0; i < 13; i++) {
      test("create book", async () => {
        const fake_data: CreateBookRequest = {
          name: faker.internet.userName() + Math.floor(Math.random() * 100),
          avatar: faker.image.avatar(),
          discounted: Math.floor(Math.random() * 100),
          price_import: Number(faker.commerce.price()),
          price_export: Number(faker.commerce.price()),
          sold: Math.floor(Math.random() * 1000),
          views: Math.floor(Math.random() * 1000),
          published_date: faker.date.past(10),
          quantity: Math.floor(Math.random() * 100),
          publisher: faker.internet.userName(),
          author: faker.internet.userName(),
          description: faker.commerce.productDescription(),
          images_url: [
            faker.image.imageUrl(),
            faker.image.imageUrl(),
            faker.image.imageUrl(),
            faker.image.imageUrl(),
            faker.image.imageUrl(),
            faker.image.imageUrl(),
          ],
          supplier_id:
            list_supplier[Math.floor(Math.random() * list_supplier.length)].id,
          category_id: [
            list_category[i].id,
            list_category[i + 1].id,
            list_category[i + 2].id,
            list_category[i + 3].id,
            list_category[i + 4].id,
          ],
        };
        const { body: data } = await request
          .post(`/api/books`)
          .send(fake_data)
          .set("Authorization", `Bear ${accessToken}`);
        expect(data.type).toBe("success");
      });
    }

    test("get list book", async () => {
      const { body: data } = await request.get(`/api/books`);
      list_book = data.data;
      expect(list_book.length).toBeGreaterThan(10);
      expect(list_book[0].images.length).toBeGreaterThan(0);
      expect(list_book[0].categories.length).toBeGreaterThan(0);
      expect(Object.keys(list_book[0].supplier)[0] === "id").toBe(true);
      book_to_be_delete = list_book.pop();
      list_book_to_be_delete = list_book.splice(0, 5).map((item) => item.id);
    });

    test("update book", async () => {
      const categories_update = differenceBy(
        list_category,
        book_to_be_delete.categories,
        "id"
      );

      const fake_data: UpdateBookRequest = {
        id: book_to_be_delete.id,
        name: faker.internet.userName() + Math.floor(Math.random() * 100),
        avatar: faker.image.avatar(),
        discounted: Math.floor(Math.random() * 100),
        price_import: Number(faker.commerce.price()),
        price_export: Number(faker.commerce.price()),
        sold: Math.floor(Math.random() * 1000),
        views: Math.floor(Math.random() * 1000),
        published_date: faker.date.past(10),
        quantity: Math.floor(Math.random() * 100),
        publisher: faker.internet.userName(),
        author: faker.internet.userName(),
        description: faker.commerce.productDescription(),
        image_delete: [book_to_be_delete.images[0].id],
        image_update: [
          {
            url: "https://newshop.vn/public/uploads/content/bach-khoa-cham-soc-con-tre-toan-dien-ndung.jpg",
            order: 5,
          },
        ],
        category_delete: [
          book_to_be_delete.categories[0].id,
          book_to_be_delete.categories[1].id,
          book_to_be_delete.categories[2].id,
          book_to_be_delete.categories[3].id,
        ],
        category_update: [...categories_update.map((item) => item.id)],
        supplier_update: list_supplier[0].id,
      };

      const { body: data } = await request
        .put(`/api/books`)
        .send(fake_data)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(true).toBe(true);
    });

    test("delete book", async () => {
      const { body: data } = await request
        .delete(`/api/books/${book_to_be_delete.id}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.affected).toBe(1);
    });

    test("delete muitiple book", async () => {
      const { body: data } = await request
        .delete(`/api/books/multiple?ids=${list_book_to_be_delete.toString()}`)
        .set("Authorization", `Bear ${accessToken}`);
      expect(data.type).toBe("success");
      expect(data.data.book_deleted.length).toBeGreaterThan(0);
    });
  });

  describe("rating controller", () => {
    test("delete category", async () => {
      for (const user of list_user) {
        for (const book of list_book) {
          const fake_data = {
            user_id: user.id,
            book_id: book.id,
            rating_number: Math.floor(Math.random() * 6),
            content: faker.lorem.paragraphs(),
          };

          const { body: data } = await request
            .post(`/api/rating`)
            .send(fake_data);
          expect(data.type).toBe("success");
        }
      }
    });
  });
});
