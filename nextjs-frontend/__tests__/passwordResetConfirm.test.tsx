import { passwordResetConfirm } from "@/components/actions/password-reset-action";
import { resetResetPassword } from "@/app/clientService";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("../app/openapi-client/services.gen", () => ({
  resetResetPassword: jest.fn(),
}));

jest.mock("../lib/clientConfig", () => ({
  client: {
    setConfig: jest.fn(),
  },
}));

describe("passwordReset action", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call resetPassword with the correct input", async () => {
    const formData = new FormData();
    formData.set("resetToken", "token");
    formData.set("password", "P12345678#");
    formData.set("passwordConfirm", "P12345678#");
    // Mock a successful password reset confirm
    (resetResetPassword as jest.Mock).mockResolvedValue({});

    await passwordResetConfirm({}, formData);

    expect(resetResetPassword).toHaveBeenCalledWith({
      body: { token: "token", password: "P12345678#" },
    });
    expect(redirect).toHaveBeenCalled();
  });

  it("should return an error message if password reset fails", async () => {
    const formData = new FormData();
    formData.set("resetToken", "invalid_token");
    formData.set("password", "P12345678#");
    formData.set("passwordConfirm", "P12345678#");

    // Mock a failed password reset
    (resetResetPassword as jest.Mock).mockResolvedValue({
      error: { detail: "Invalid token" },
    });

    const result = await passwordResetConfirm(undefined, formData);

    expect(result).toEqual({ server_validation_error: "Invalid token" });
    expect(resetResetPassword).toHaveBeenCalledWith({
      body: { token: "invalid_token", password: "P12345678#" },
    });
  });

  it("should return an validation error if passwords are invalid and don't match", async () => {
    const formData = new FormData();
    formData.set("resetToken", "token");
    formData.set("password", "12345678#");
    formData.set("passwordConfirm", "45678#");

    const result = await passwordResetConfirm(undefined, formData);

    expect(result).toEqual({
      errors: {
        password: ["Password should contain at least one uppercase letter."],
        passwordConfirm: ["Passwords must match."],
      },
    });
    expect(resetResetPassword).not.toHaveBeenCalledWith();
  });
});
