import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Page from "@/app/login/page";
import { login } from "@/components/actions/login-action";

jest.mock("../components/actions/login-action", () => ({
  login: jest.fn(),
}));

describe("Login Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with username and password input and submit button", () => {
    render(<Page />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("calls login in successful form submission", async () => {
    (login as jest.Mock).mockResolvedValue({
      message: "Password reset instructions sent to your email.",
    });

    render(<Page />);

    const emailInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "#123176a@" } });

    fireEvent.click(submitButton);

    await waitFor(() => {});

    expect(login).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(FormData),
    );
  });

  it("displays error message if login fails", async () => {
    (login as jest.Mock).mockResolvedValue({
      message: "LOGIN_BAD_CREDENTIALS",
    });

    render(<Page />);

    const emailInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalid@invalid.com" } });
    fireEvent.change(passwordInput, { target: { value: "#123176a@" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("LOGIN_BAD_CREDENTIALS")).toBeInTheDocument();
    });

    expect(login).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(FormData),
    );
  });
});
