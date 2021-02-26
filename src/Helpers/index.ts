export const strongPassword = (password: string): boolean => {
    const regex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$");
    return regex.test(password);
}