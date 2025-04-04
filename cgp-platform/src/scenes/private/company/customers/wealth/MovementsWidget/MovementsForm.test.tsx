import { describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "../../../../../../tests/test-utils";
import { MouvementForm } from "./MovementsForm";

// Mock de useQuery
vi.mock("react-query", () => ({
  useQuery: vi.fn(() => ({
    data: {},
    isLoading: false,
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RouterProvider: vi.fn(),
  useRouter: vi.fn(),
}));

describe("Movements Component", () => {
  describe("MovementForm", () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
      mockSubmit.mockClear();
    });

    it("renders all form fields", async () => {
      render(<MouvementForm onSubmit={mockSubmit} />);

      await waitFor(() => {
        // Check form field rendering
        expect(screen.getByTestId("name")).toBeDefined();
        expect(screen.getByTestId("typeOperation")).toBeDefined();
        expect(screen.getByTestId("value")).toBeDefined();
        expect(screen.getByTestId("fee")).toBeDefined();
        expect(screen.getByTestId("date")).toBeDefined();
        expect(screen.getByTestId("dateBO")).toBeDefined();
        expect(screen.getByTestId("manager")).toBeDefined();
        expect(screen.getByTestId("comment")).toBeDefined();
        expect(screen.getByTestId("submit")).toBeDefined();
      });
    });
  });
});
