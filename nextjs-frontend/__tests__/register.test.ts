import { register } from "@/components/actions/register-action";
import { redirect } from "next/navigation";
import { registerRegister } from "@/app/clientService";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("../app/clientService", () => ({
  registerRegister: jest.fn(),
}));

describe("register action", () => {
  it("should call register service action with the correct input", async () => {
    const formData = new FormData();
    formData.set("email", "a@a.com");
    formData.set("password", "Q12341414#");

    (registerRegister as jest.Mock).mockResolvedValue({});

    await register({}, formData);

    expect(registerRegister).toHaveBeenCalledWith({
      body: {
        email: "a@a.com",
        password: "Q12341414#",
      },
    });

    expect(redirect).toHaveBeenCalled();
  });
  it("should should return an error if the server call fails", async () => {
    const formData = new FormData();
    formData.set("email", "a@a.com");
    formData.set("password", "Q12341414#");

    (registerRegister as jest.Mock).mockResolvedValue({
      error: {
        detail: "REGISTER_USER_ALREADY_EXISTS",
      },
    });

    const result = await register({}, formData);

    expect(registerRegister).toHaveBeenCalledWith({
      body: {
        email: "a@a.com",
        password: "Q12341414#",
      },
    });
    expect(result).toEqual({ message: "REGISTER_USER_ALREADY_EXISTS" });
  });
});
