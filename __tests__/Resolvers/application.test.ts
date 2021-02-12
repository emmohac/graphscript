import jwt from "jsonwebtoken";
import faker from "faker";

import { ApplicationResponseTC } from "../../src/Resolvers/application";
import { InvalidToken, JwtExpired, JwtNotProvided } from "../../src/Errors";
import { UserModel } from "../../src/Models/User";

describe("ApplicationResponseTC", () => {
  describe("add_application", () => {
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
          authorization: `Bearer ${token}`
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
      UserModel.findOneAndUpdate = jest.fn().mockResolvedValueOnce("resolved");

      const unitUnderTest = await ApplicationResponseTC.getResolver(
        "add_application"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        successful: true,
        errors: []
      });
      jest.clearAllMocks();
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
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
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
});
