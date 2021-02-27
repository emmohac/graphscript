import { strongPassword } from "../../src/Helpers";

describe("strongPassword", () => {
  test("When password is strong, should return true", () => {
    const password = "Str0ngp@ssword!";
    expect(strongPassword(password)).toBeTruthy();
  });
  test("When password has length less than 7, should return false", () => {
    const password = "L3ss!";
    expect(strongPassword(password)).toBeFalsy();
  });
  test("When password has no number, should return false", () => {
    const password = "NoNumber!";
    expect(strongPassword(password)).toBeFalsy();
  });
  test("When password has no uppercase letter, should return false", () => {
    const password = "lowerc@s30nly!";
    expect(strongPassword(password)).toBeFalsy();
  });
  test("When password has no lowercase letter, should return false", () => {
    const password = "UPP3RCASE!!!";
    expect(strongPassword(password)).toBeFalsy();
  });
  test("When password has no special leter, should return false", () => {
    const password = "n0sp3cial";
    expect(strongPassword(password)).toBeFalsy();
  });
});
