import jwt from "jsonwebtoken";
import faker from "faker";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { ApplicationResponseTC } from "../../src/Resolvers/application";
import { InvalidToken, JwtExpired, JwtNotProvided } from "../../src/Errors";
import { userSchema } from "../../src/Models/User";
import { getConnection } from "../../src/Databases";

describe("ApplicationResponseTC", () => {
  describe("add_application", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });
    test("When authorization is not provided, should return JwtNotProvided", async () => {
      const resolveParams = {
        context: {
          authorization: ""
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "add_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtNotProvided);
    });

    test("When authorization is invalid, should return InvalidToken", async () => {
      const resolveParams = {
        context: {
          authorization: "invalid"
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "add_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(InvalidToken);
    });

    test("When authorization is valid and not expired, should return successful", async () => {
      const conn = await getConnection();

      conn.model(
        "user",
        userSchema
      ).findOneAndUpdate = jest.fn().mockResolvedValueOnce("resolved");
      const fakeUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };
      process.env.SECRET_KEY = "test";
      const token = jwt.sign(fakeUser, process.env.SECRET_KEY, {
        expiresIn: 10
      });
      const resolveParams = {
        context: {
          authorization: `Bearer ${token}`,
          conn
        },
        args: {
          input: {
            applications: [
              {
                companyName: faker.company.companyName(),
                applicationDate: faker.date.recent()
              }
            ]
          }
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "add_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });

    test("When authorization is valid but expired, should return JwtExpired", async () => {
      const fakeUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };
      process.env.SECRET_KEY = "test";
      const token = jwt.sign(fakeUser, process.env.SECRET_KEY, {
        expiresIn: 1
      });
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(2000);
      const resolveParams = {
        context: {
          authorization: `Bearer ${token}`
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "add_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtExpired);
    });
  });

  describe("remove_application", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });
    test("When authorization is not provided, should return JwtNotProvided", async () => {
      const resolveParams = {
        context: {
          authorization: ""
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "remove_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtNotProvided);
    });

    test("When authorization is invalid, should return InvalidToken", async () => {
      const resolveParams = {
        context: {
          authorization: "invalid"
        },
        args: {
          input: {
            applications: [{}]
          }
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "remove_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(InvalidToken);
    });

    test("When authorization is valid but expired, should return JwtExpired", async () => {
      const fakeUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };
      process.env.SECRET_KEY = "test";
      const token = jwt.sign(fakeUser, process.env.SECRET_KEY, {
        expiresIn: 1
      });
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(2000);
      const resolveParams = {
        context: {
          authorization: `Bearer ${token}`
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "remove_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtExpired);
    });

    test("When authorization is valid, should return successful", async () => {
      const conn = await getConnection();
      conn.model(
        "user",
        userSchema
      ).findOneAndUpdate = jest.fn().mockResolvedValueOnce("resolved");
      const fakeUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };
      process.env.SECRET_KEY = "test";
      const token = jwt.sign(fakeUser, process.env.SECRET_KEY, {
        expiresIn: 10
      });

      const resolveParams = {
        context: {
          authorization: `Bearer ${token}`,
          conn
        },
        args: {
          input: {
            applications: [{}]
          }
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "remove_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });
  });

  describe("get_application", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });
    test("When authorization is not provided, should return JwtNotProvided", async () => {
      const resolveParams = {
        context: {
          authorization: ""
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "get_applications"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtNotProvided);
    });

    test("When authorization is not valid, should return InvalidToken", async () => {
      const resolveParams = {
        context: {
          authorization: "invalid"
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "get_applications"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(InvalidToken);
    });

    test("When authorization is expired, should return JwtExpired", async () => {
      const fakeUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };
      process.env.SECRET_KEY = "test";
      const token = jwt.sign(fakeUser, process.env.SECRET_KEY, {
        expiresIn: 1
      });
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(2000);
      const resolveParams = {
        context: {
          authorization: `Bearer ${token}`
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "get_applications"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtExpired);
    });

    test("When authorization is valid, should return successful", async () => {
      const conn = await getConnection();
      const fakeApplications = [
        {
          companyName: faker.company.companyName(),
          applicationDate: faker.date.recent()
        }
      ];

      conn.model("user", userSchema).findOne = jest.fn().mockResolvedValueOnce({
        applications: fakeApplications
      });
      const fakeUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };
      process.env.SECRET_KEY = "test";
      const token = jwt.sign(fakeUser, process.env.SECRET_KEY, {
        expiresIn: 5
      });
      const resolveParams = {
        context: {
          authorization: `Bearer ${token}`,
          conn
        }
      };

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "get_applications"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        items: fakeApplications,
        errors: []
      });

      jest.clearAllMocks();
      await conn.close();
    });
  });
});
