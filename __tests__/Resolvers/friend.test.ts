import jwt from "jsonwebtoken";
import faker from "faker";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { FriendResponseTC } from "../../src/Resolvers/friend";
import { getConnection } from "../../src/Databases";
import {
  InvalidToken,
  JwtExpired,
  JwtNotProvided,
  FriendNotExist
} from "../../src/Errors";
import { userSchema } from "../../src/Models/User";

describe("FriendResponseTC", () => {
  describe("add_friend", () => {
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

      const unitUnderTest = await FriendResponseTC.getResolver(
        "add_friend"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtNotProvided);
    });

    test("When authorization is invalid, should return InvalidToken", async () => {
      const resolveParams = {
        context: {
          authorization: "invalid"
        }
      };

      const unitUnderTest = await FriendResponseTC.getResolver(
        "add_friend"
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

      const unitUnderTest = await FriendResponseTC.getResolver(
        "add_friend"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(JwtExpired);
    });

    test("When authorization is valid but friend email not exist, should return FriendNotExist", async () => {
      const conn = await getConnection();
      conn.model("user", userSchema).findOne = jest
        .fn()
        .mockResolvedValueOnce(null);
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
        },
        args: {
          email: faker.internet.email()
        }
      };
      const unitUnderTest = await FriendResponseTC.getResolver(
        "add_friend"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(FriendNotExist);
      jest.clearAllMocks();
      await conn.close();
    });

    test("When authorization and friend email are valid, should return successful", async () => {
      const conn = await getConnection();
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
        },
        args: {
          email: faker.internet.email()
        }
      };
      conn.model("user", userSchema).findOne = jest.fn().mockResolvedValueOnce({
        _id: faker.random.uuid()
      });
      conn.model(
        "user",
        userSchema
      ).findOneAndUpdate = jest.fn().mockResolvedValueOnce("Success");

      const unitUnderTest = await FriendResponseTC.getResolver(
        "add_friend"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });
  });

  describe("get_friend", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });
    test("When authorization is valid, should return successful and items", async () => {
      const conn = await getConnection();
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
        },
        args: {
          email: faker.internet.email()
        }
      };
      const fakeFriendEmail = faker.internet.email();
      conn.model("user", userSchema).findOne = jest.fn().mockResolvedValueOnce({
        friends: [fakeFriendEmail]
      });

      const unitUnderTest = await FriendResponseTC.getResolver(
        "get_friend"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        items: [fakeFriendEmail],
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });
  });

  describe("remove_friend", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });
    test("When authorization and friend email is valid, should return successful", async () => {
      const conn = await getConnection();
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
        },
        args: {
          email: faker.internet.email()
        }
      };
      conn.model(
        "user",
        userSchema
      ).findOneAndUpdate = jest.fn().mockResolvedValueOnce({
        _id: faker.random.uuid()
      });

      const unitUnderTest = await FriendResponseTC.getResolver(
        "remove_friend"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });
  });

  describe("get_friend_application", () => {
    const mongod = new MongoMemoryServer();
    beforeEach(async () => {
      const uri = await mongod.getUri();
      process.env.MONGO_CONNECTION_STRING_ATLAS = uri;
    });
    afterEach(async () => {
      await mongoose.connection.close();
      await mongod.stop();
    });
    test("When authorization and email is valid, should return successful and applications", async () => {
      const conn = await getConnection();
      const fakeUserEmail = faker.internet.email();
      const fakeUser = {
        email: fakeUserEmail,
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };
      process.env.SECRET_KEY = "test";
      const token = jwt.sign(fakeUser, process.env.SECRET_KEY, {
        expiresIn: 5
      });
      const fakeFriendEmail = faker.internet.email();
      const resolveParams = {
        context: {
          authorization: `Bearer ${token}`,
          conn
        },
        args: {
          email: fakeFriendEmail 
        }
      };
      const fakeApplications = [
        {
          companyName: faker.company.companyName(),
          applicationDate: faker.date.recent()
        }
      ];
      conn.model("user", userSchema).findOne = jest.fn().mockResolvedValueOnce({
        applications: fakeApplications,
        friends: [fakeUserEmail]
      });

      const unitUnderTest = await FriendResponseTC.getResolver(
        "get_friend_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        applications: fakeApplications,
        errors: []
      });
      jest.clearAllMocks();
      await conn.close();
    });
  });
});
