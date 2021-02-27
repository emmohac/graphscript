export const strongPassword = (password: string): boolean => {
  const regex = new RegExp(
    "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$"
  );
  return regex.test(password);
};
