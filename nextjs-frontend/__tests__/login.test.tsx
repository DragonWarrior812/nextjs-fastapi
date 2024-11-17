import { login } from "@/components/actions/login-action";
import { authJwtLogin } from "@/app/clientService";
import { cookies } from "next/headers";

jest.mock("../app/clientService", () => ({
  authJwtLogin: jest.fn(),
}));

jest.mock("next/headers", () => {
  const mockSet = jest.fn();
  return { cookies: jest.fn().mockResolvedValue({ set: mockSet }) };
});

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("login action", () => {
  it("should call login service action with the correct input", async () => {
    const formData = new FormData();
    formData.set("username", "a@a.com");
    formData.set("password", "Q12341414#");

    const mockSet = (await cookies()).set;

    (authJwtLogin as jest.Mock).mockResolvedValue({
      data: { access_token: "1245token" },
    });

    await login({}, formData);

    expect(authJwtLogin).toHaveBeenCalledWith({
      body: {
        username: "a@a.com",
        password: "Q12341414#",
      },
    });

    expect(cookies).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith("accessToken", "1245token");
  });

  it("should should return an error if the server call fails", async () => {
    const formData = new FormData();
    formData.set("username", "invalid@invalid.com");
    formData.set("password", "Q12341414#");

    (authJwtLogin as jest.Mock).mockResolvedValue({
      error: {
        detail: "LOGIN_BAD_CREDENTIALS",
      },
    });

    const result = await login({}, formData);

    expect(authJwtLogin).toHaveBeenCalledWith({
      body: {
        username: "invalid@invalid.com",
        password: "Q12341414#",
      },
    });

    expect(result).toEqual({ message: "LOGIN_BAD_CREDENTIALS" });

    expect(cookies).not.toHaveBeenCalled();
  });
});
