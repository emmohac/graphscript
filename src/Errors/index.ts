type ErrorResponse = {
  code: string;
  message: string;
};

type UserResponse = {
  isRegistered?: boolean;
  isAuthenticated?: boolean;
  errors: ErrorResponse[];
};

export const InvalidFieldError: UserResponse = {
  isRegistered: false,
  errors: [
    {
      code: "invalid-input",
      message: "Input fields contain invalid character"
    }
  ]
};

export const DuplicatedUserError: UserResponse = {
  isRegistered: false,
  errors: [
    {
      code: "user-duplicated",
      message: "User with this information already registered"
    }
  ]
};

export const UserNotFoundError: UserResponse = {
  isAuthenticated: false,
  errors: [
    {
      code: "user-not-found",
      message: "User with this information does not exist"
    }
  ]
};

export const IncorrectInformation: UserResponse = {
  isAuthenticated: false,
  errors: [
    {
      code: "incorrect-username-or-password",
      message: "Username or password is incorrect"
    }
  ]
};
