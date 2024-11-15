import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Page from "@/app/password-recovery/page";
import { passwordReset } from "@/components/actions/password-reset-action";

jest.mock("../components/actions/password-reset-action", () => ({
  passwordReset: jest.fn(),
}));

describe("Password Reset Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with email input and submit button", () => {
    render(<Page />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("displays success message on successful form submission", async () => {
    // Mock the password reset action to resolve successfully
    (passwordReset as jest.Mock).mockResolvedValue({
      message: "Password reset instructions sent to your email.",
    });

    render(<Page />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
    fireEvent.click(submitButton);

    // Wait for success message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Password reset instructions sent to your email."),
      ).toBeInTheDocument();
    });

    expect(passwordReset).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(FormData),
    );
  });

  it("displays error message if password reset fails", async () => {
    // Mock the password reset action to return an error
    (passwordReset as jest.Mock).mockResolvedValue({
      message: "User not found",
    });

    render(<Page />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, {
      target: { value: "invaliduser@example.com" },
    });
    fireEvent.click(submitButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });

    expect(passwordReset).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(FormData),
    );
  });
});
