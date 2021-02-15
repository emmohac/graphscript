type ErrorResponse = {
  code: string;
  message: string;
};

type UserResponse = {
  isRegistered?: boolean;
  isAuthenticated?: boolean;
  errors: ErrorResponse[];
};

type ApplicationResponse = {
  successful: boolean;
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

export const JwtNotProvided: ApplicationResponse = {
  successful: false,
  errors: [
    {
      code: "jwt-not-provided",
      message: "Please login to get valid JWT"
    }
  ]
};

export const JwtExpired: ApplicationResponse = {
  successful: false,
  errors: [
    {
      code: "jwt-expired",
      message: "Jwt has expired"
    }
  ]
};

export const InvalidToken: ApplicationResponse = {
  successful: false,
  errors: [
    {
      code: "jwt-invalid",
      message: "Invalid jwt token"
    }
  ]
};
