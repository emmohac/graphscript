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
  const mongod = new MongoMemoryServer();
  let conn: mongoose.Connection;
  beforeAll(async () => {
    const uri = await mongod.getUri();
    process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    conn = await getConnection();
  });
  afterEach(async () => {
    await mongoose.connection.close();
    await mongod.stop();
    await conn.close();
  });
  describe("register", () => {
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
    });

    test("When input fields are valid and user have not registered, should return successful", async () => {
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
    });
  });

  describe("login", () => {
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
    });

    test("When user provides incorrect password, should return IncorrectInformation", async () => {
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
    });

    test("When user provides correct information, should return successful", async () => {
      const fakePassword = faker.internet.password();
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
    });
  });
});
