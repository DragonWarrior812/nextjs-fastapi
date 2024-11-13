import { passwordReset } from "@/components/actions/password-reset-action";
import { resetForgotPassword } from "@/app/clientService";

jest.mock("../app/openapi-client/services.gen", () => ({
  resetForgotPassword: jest.fn(),
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

  it("should call resetForgotPassword with the correct input", async () => {
    const formData = new FormData();
    formData.set("email", "testuser@example.com");

    // Mock successful password reset
    resetForgotPassword.mockResolvedValue({});

    const result = await passwordReset({}, formData);

    expect(resetForgotPassword).toHaveBeenCalledWith({
      body: { email: "testuser@example.com" },
    });
    expect(result).toEqual({
      message: "Password reset instructions sent to your email.",
    });
  });

  it("should return an error message if password reset fails", async () => {
    const formData = new FormData();
    formData.set("email", "testuser@example.com");

    // Mock a failed password reset
    resetForgotPassword.mockResolvedValue({
      error: { detail: "User not found" },
    });

    const result = await passwordReset({}, formData);

    expect(result).toEqual({ message: "User not found" });
    expect(resetForgotPassword).toHaveBeenCalledWith({
      body: { email: "testuser@example.com" },
    });
  });
});
