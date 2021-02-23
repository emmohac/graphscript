import faker from "faker";
import mongoose from "mongoose";
import cryptoJS from "crypto";
import { MongoMemoryServer } from "mongodb-memory-server";

import { UserResponseTC } from "../../src/Resolvers/user";
import { getConnection } from "../../src/Databases";
import {
  InvalidFieldError,
  DuplicatedUserError,
  UserNotFoundError,
  IncorrectInformation
} from "../../src/Errors";
import { userSchema } from "../../src/Models/User";

describe("UserResponseTC", () => {
  describe("register", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });

    test("When input fields are not valid, should return InvalidFieldError", async () => {
      const fakeUser = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        phoneNumber: faker.phone.phoneNumberFormat()
      };

      const resolveParams = {
        args: {
          input: fakeUser
        }
      };

      const unitUnderTest = await UserResponseTC.getResolver(
        "register"
      ).resolve(resolveParams);
      expect(typeof unitUnderTest).toEqual(typeof InvalidFieldError);
      expect(unitUnderTest.isRegistered).toBeFalsy();
      expect(unitUnderTest.errors).toHaveLength(1);
    });

    test("When user already registered, should return DuplicatedUserError", async () => {
      const conn = await getConnection();
      conn.model("user", userSchema).findOne = jest.fn().mockResolvedValueOnce({
        _id: faker.random.uuid()
      });
      const fakeUser = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumberFormat()
      };
      const resolveParams = {
        args: {
          input: fakeUser
        },
        context: {
          conn
        }
      };

      const unitUnderTest = await UserResponseTC.getResolver(
        "register"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(DuplicatedUserError);
      jest.clearAllMocks();
      await conn.close();
    });

    test("When input fields are valid and user have not registered, should return successful", async () => {
      const conn = await getConnection();
      conn.model("user", userSchema).findOne = jest
        .fn()
        .mockResolvedValueOnce(null);
      const fakeUser = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumberFormat()
      };
      conn.model("user", userSchema).create = jest.fn().mockResolvedValueOnce({
        _id: faker.random.uuid(),
        ...fakeUser
      });
      const resolveParams = {
        args: {
          input: fakeUser
        },
        context: {
          conn
        }
      };

      const unitUnderTest = await UserResponseTC.getResolver(
        "register"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        isRegistered: true,
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });
  });

  describe("login", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });

    test("When user has not registered before, should return UserNotFoundError", async () => {
      const conn = await getConnection();
      conn.model("user", userSchema).findOne = jest
        .fn()
        .mockResolvedValueOnce(null);
      const resolveParams = {
        args: {
          input: {
            email: faker.internet.email(),
            password: faker.internet.password()
          }
        },
        context: {
          conn
        }
      };

      const unitUnderTest = await UserResponseTC.getResolver("login").resolve(
        resolveParams
      );

      expect(unitUnderTest).toStrictEqual(UserNotFoundError);
      jest.clearAllMocks();
      await conn.close();
    });

    test("When user provides incorrect password, should return IncorrectInformation", async () => {
      const conn = await getConnection();
      conn.model("user", userSchema).findOne = jest.fn().mockResolvedValueOnce({
        password: "fakePassword",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      });
      const resolveParams = {
        args: {
          input: {
            email: faker.internet.email(),
            password: faker.internet.password()
          }
        },
        context: {
          conn
        }
      };

      const unitUnderTest = await UserResponseTC.getResolver("login").resolve(
        resolveParams
      );

      expect(unitUnderTest).toStrictEqual(IncorrectInformation);
      jest.clearAllMocks();
      await conn.close();
    });

    test("When user provides correct information, should return successful", async () => {
      const fakePassword = faker.internet.password();
      const conn = await getConnection();
      conn.model("user", userSchema).findOne = jest.fn().mockResolvedValueOnce({
        password: cryptoJS
          .createHash("sha256")
          .update(fakePassword)
          .digest("hex"),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      });

      const resolveParams = {
        args: {
          input: {
            email: faker.internet.email(),
            password: fakePassword
          }
        },
        context: {
          conn
        }
      };

      process.env.SECRET_KEY = "test";
      const unitUnderTest = await UserResponseTC.getResolver("login").resolve(
        resolveParams
      );

      expect(unitUnderTest).toMatchObject({
        isAuthenticated: true,
        token: expect.any(String),
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });
  });
});
