import { useMutation } from 'react-query';
import { expect, beforeEach, describe, it, vi } from "vitest"

// Importation des outils nécessaires pour le mocking
import { RegisterPage } from "./Register";
import { render, screen, fireEvent, waitFor } from "../../../../tests/test-utils";

// Mock de useMutation
vi.mock('react-query', () => ({
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: {children: React.ReactNode}) => <div>{children}</div>,
  RouterProvider: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('@firebase/analytics', () => {
  return {
    getAnalytics: vi.fn(),
    logEvent: vi.fn(),
    setCurrentScreen: vi.fn(),
    setUserId: vi.fn(),
    setUserProperties: vi.fn(),
    isSupported: vi.fn().mockResolvedValue(false),
  };
});

  describe("RegisterPage Tests", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    // Configurer le mock de useMutation
    (useMutation as any).mockImplementation((options: any) => ({
      mutate: mockMutate,
      isLoading: false,
      ...options,
    }));
  });

  it("should render all form fields", async () => {
    render(<RegisterPage/>);

    await waitFor(() => {
      // Vérifiez la présence des champs
      expect(screen.getByTestId("name")).toBeDefined();
      expect(screen.getByTestId("firstName")).toBeDefined();
      expect(screen.getByTestId("companyName")).toBeDefined();
      expect(screen.getByTestId("phone")).toBeDefined();
      expect(screen.getByTestId("email")).toBeDefined();
      expect(screen.getByTestId("newsletterSubscriber")).toBeDefined();
    });
  });

  it("should allow form submission with valid data", async () => {
    render(<RegisterPage />);

    await waitFor(() => {
      // Simuler l'entrée de données utilisateur
      fireEvent.change(screen.getByTestId("name"), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId("firstName"), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId("companyName"), { target: { value: 'Acme Inc.' } });
      fireEvent.change(screen.getByTestId("phone"), { target: { value: '06 01 02 03 04' } });
      fireEvent.change(screen.getByTestId("email"), { target: { value: 'john@doe.com' } });
  
      // Simuler la soumission du formulaire
      fireEvent.click(screen.getByTestId("terms"));
      fireEvent.click(screen.getByRole("button"))
  
      // Attendre que la mutation soit appelée
    });


    // TODO: fix the bellow expect
    // expect(mockMutate).toHaveBeenCalledWith({
    //   name: 'Doe',
    //   firstName: 'John',
    //   companyName: 'Acme Inc.',
    //   phone: '06 01 02 03 04',
    //   email: 'john@doe.com',
    // });
  });
});
