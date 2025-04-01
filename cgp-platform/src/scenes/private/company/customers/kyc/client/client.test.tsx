import ResizeObserver from "resize-observer-polyfill";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockRouterSetup,
  resetRouterMocks,
  updateCustomerInformationsGeneralMock,
} from "../../../../../../mocks/test/react-query.setup";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../../tests/test-utils";
import PersonalInfoForm from "./forms/PersonalInfoForm";

describe("KYC - Client", () => {
  // Prevent error from ResizeObserver from <RadioGroup /> : ResizeObserver is not defined
  global.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    mockRouterSetup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetRouterMocks();
  });

  it("Should renders fields", async () => {
    render(
      <PersonalInfoForm
        data={{}}
        onSubmit={() => console.log("Form submitted")}
        isLoading={false}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("personalInfo-gender")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-firstName")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-lastName")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-birthName")).toBeInTheDocument();
      expect(
        screen.getByTestId("personalInfo-firstPhoneNumber")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("personalInfo-personalEmail")
      ).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-street")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-country")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-zipCode")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-birthCity")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-birthDate")).toBeInTheDocument();
      expect(
        screen.getByTestId("personalInfo-nationality")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("personalInfo-fiscalAddress")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("personalInfo-studiesLevel")
      ).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-occupation")).toBeInTheDocument();
      expect(screen.getByTestId("personalInfo-usPerson")).toBeInTheDocument();
    });
  });

  it("should correctly submit all personal information form fields when form is submitted", async () => {
    render(
      <PersonalInfoForm
        data={{
          gender: "male",
          birthDate: "1990-01-01",
          nationality: "FR",
          country: "FR",
          fiscalAddress: "FR",
        }}
        onSubmit={updateCustomerInformationsGeneralMock}
        isLoading={false}
      />
    );

    await waitFor(() => {
      // Personal information section - Select and FieldText
      fireEvent.change(screen.getByTestId("personalInfo-gender"), {
        target: { value: "male" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-firstName"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-lastName"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-birthName"), {
        target: { value: "Birth Name" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-firstPhoneNumber"), {
        target: { value: "0123456789" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-personalEmail"), {
        target: { value: "john.doe@example.com" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-street"), {
        target: { value: "123 Main Street" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-zipCode"), {
        target: { value: "75000" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-birthCity"), {
        target: { value: "Paris" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-studiesLevel"), {
        target: { value: "MASTER" },
      });
      fireEvent.change(screen.getByTestId("personalInfo-occupation"), {
        target: { value: "Developer" },
      });

      fireEvent.click(screen.getByTestId("personalInfo-usPerson-true"));
    });
    const submitButton = screen.getByTestId("personalInfo-submit");

    fireEvent.click(submitButton);

    await waitFor(() => {
      const callWith = updateCustomerInformationsGeneralMock.mock.calls[0][0];

      expect(callWith).toMatchObject(
        expect.objectContaining({
          lastName: "Doe",
          firstName: "John",
          gender: "male",
          zipCode: "75000",
          birthDate: "1990-01-01",
          personalEmail: "john.doe@example.com",
          birthName: "Birth Name",
          firstPhoneNumber: "0123456789",
          nationality: "FR",
          country: "FR",
          street: "123 Main Street",
          birthCity: "Paris",
          fiscalAddress: "FR",
          studiesLevel: "MASTER",
          occupation: "Developer",
          usPerson: true,
        })
      );
    });
  });
});
