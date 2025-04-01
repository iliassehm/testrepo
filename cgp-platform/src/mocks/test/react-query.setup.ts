// Common mocks used across tests
import { vi } from "vitest";

export const categoryCreationMock = vi.fn();
export const categoryDeletionMock = vi.fn();
export const documentUpdateMock = vi.fn();
export const deleteDocumentMock = vi.fn();
export const documentNotificationMock = vi.fn();
export const updateCustomerInformationsGeneralMock = vi.fn();
export const createRelationMock = vi.fn();
export const deleteRelationMock = vi.fn();
export const budgetCreationMock = vi.fn();
export const exportTasksMock = vi.fn();
// Router mocks
export function mockRouterSetup() {
  vi.mock("@tanstack/react-router", async (importOriginal) => {
    const actual =
      await importOriginal<typeof import("@tanstack/react-router")>();

    return {
      ...actual,
      useParams: vi.fn(() => ({
        companyId: "company-123",
        customerId: "customer-456",
      })),
      useSearch: vi.fn(() => ({
        category: "category-1",
        documentId: "document-2",
      })),
    };
  });
}

type MutationFn = {
  mutationKey: string;
};

// React Query mocks
export const mockReactQuerySetup = () => {
  vi.mock("react-query", async (importOriginal) => {
    const mockMap = {
      gedCategoryCreation: {
        mutate: categoryCreationMock,
        isLoading: false,
        error: null,
        data: null,
      },
      categoryDeletion: {
        mutate: categoryDeletionMock,
        isLoading: false,
        error: null,
        data: null,
      },
      documentUpdate: {
        mutate: documentUpdateMock,
        isLoading: false,
        error: null,
        data: null,
      },
      deleteDocument: {
        mutate: deleteDocumentMock,
        isLoading: false,
        error: null,
        data: null,
      },
      notifyDocumentStatus: {
        mutate: documentNotificationMock,
        isLoading: false,
        error: null,
        data: null,
      },
      updateCustomerInformationsGeneral: {
        mutate: updateCustomerInformationsGeneralMock,
        isLoading: false,
        error: null,
        data: null,
      },
      createRelationMock: {
        mutate: createRelationMock,
        isLoading: false,
        error: null,
        data: null,
      },
      deleteRelationMock: {
        mutate: createRelationMock,
        isLoading: false,
        error: null,
        data: null,
      },
      budgetCreation: {
        mutate: budgetCreationMock,
        isLoading: false,
        error: null,
        data: null,
      },
      exportTasks: {
        mutate: exportTasksMock,
        isLoading: false,
        error: null,
        data: null,
      },
    };
    const actual = await importOriginal<typeof import("react-query")>();
    return {
      ...actual,
      useMutation: (mutationFn: MutationFn) => {
        const mutationKey = mutationFn?.mutationKey;

        return (
          mockMap[mutationKey as keyof typeof mockMap] || {
            mutate: vi.fn(),
            isLoading: false,
            error: null,
            data: null,
          }
        );
      },
    };
  });
};

// Ensure mocks are reset between tests
export function resetRouterMocks() {
  vi.resetModules();
  vi.clearAllMocks();
}
