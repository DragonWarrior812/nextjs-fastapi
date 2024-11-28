import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Page from "@/app/register/page";
import { register } from "@/components/actions/register-action";

jest.mock("../components/actions/register-action", () => ({
  register: jest.fn(),
}));

describe("Register Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with email and password input and submit button", () => {
    render(<Page />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("displays success message on successful form submission", async () => {
    // Mock a successful register
    (register as jest.Mock).mockResolvedValue({});

    render(<Page />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "@1231231%a" } });
    fireEvent.click(submitButton);

    await waitFor(() => {});

    const formData = new FormData();
    formData.set("email", "testuser@example.com");
    formData.set("password", "@1231231%a");
    expect(register).toHaveBeenCalledWith({ message: "" }, formData);
  });

  it("displays error message if register fails", async () => {
    // Mock a failed register
    (register as jest.Mock).mockResolvedValue({
      message: "REGISTER_USER_ALREADY_EXISTS",
    });

    render(<Page />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "already@already.com" } });
    fireEvent.change(passwordInput, { target: { value: "@1231231%a" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("REGISTER_USER_ALREADY_EXISTS"),
      ).toBeInTheDocument();
    });

    const formData = new FormData();
    formData.set("email", "already@already.com");
    formData.set("password", "@1231231%a");
    expect(register).toHaveBeenCalledWith({ message: "" }, formData);
  });

  it("displays validation errors if password and email are invalid", async () => {
    // Mock a successful password register
    (register as jest.Mock).mockResolvedValue({
      errors: {
        email: ["Invalid email address"],
        password: [
          "Password should contain at least one uppercase letter.",
          "Password should contain at least one special character.",
        ],
      },
    });

    render(<Page />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "email@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "invalid_password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "- Password should contain at least one uppercase letter.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "- Password should contain at least one special character.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    const formData = new FormData();
    formData.set("email", "email@email.com");
    formData.set("password", "invalid_password");
    expect(register).toHaveBeenCalledWith({ message: "" }, formData);
  });
});
