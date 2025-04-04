import { vi } from "vitest";

import {
  createRelationMock,
  deleteRelationMock,
} from "../../../../../../mocks/test/react-query.setup";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../../tests/test-utils";
import RelationForm from "./forms/RelationForm";
import ChildrenSection from "./sections/ChildrenSection";
import GrandChildrenSection from "./sections/GrandChildrenSection";
import MaternalParentsSection from "./sections/MaternalParentsSection";
import PaternalParentsSection from "./sections/PaternalParentsSection";
import RelationTable from "./tables/RelationTable";

describe("Relation Sections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all fields for all relations sections", async () => {
    render(
      <>
        <ChildrenSection
          data={[]}
          refetchRelationData={() => console.log("submit")}
          linkedRelations={[]}
        />
        <GrandChildrenSection
          data={[]}
          refetchRelationData={() => console.log("submit")}
          linkedRelations={[]}
        />
        <MaternalParentsSection
          data={[]}
          refetchRelationData={() => console.log("submit")}
          linkedRelations={[]}
        />
        <PaternalParentsSection
          data={[]}
          refetchRelationData={() => console.log("submit")}
          linkedRelations={[]}
        />
      </>
    );

    await waitFor(() => {
      const sectionsNames = [
        "childrens",
        "grandChildrens",
        "maternalParents",
        "paternalParents",
      ];
      for (let i = 0; i < sectionsNames.length; i++) {
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-firstName`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-lastName`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-nationality`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-birthDate`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-denomination`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-phone`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-email`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-birthPlace`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-countryOfBirth`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`relation-${sectionsNames[i]}-maritalStatus`)
        ).toBeInTheDocument();
      }
    });
  });

  it("should correctly create a relation", async () => {
    render(
      <RelationForm
        sectionName="childrens"
        onSubmit={createRelationMock}
        defaultValues={{
          id: "1",
          denomination: "sonOf",
          firstName: "",
          lastName: "",
          birthDate: new Date("1990-01-01"),
          birthPlace: "",
          nationality: "FR",
          countryOfBirth: "FR",
          maritalStatus: "single",
          phone: "",
          email: "",
        }}
      />
    );

    await waitFor(() => {
      // Personal information section - Select and FieldText
      fireEvent.change(screen.getByTestId("relation-childrens-firstName"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByTestId("relation-childrens-lastName"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByTestId("relation-childrens-phone"), {
        target: { value: "0123456789" },
      });
      fireEvent.change(screen.getByTestId("relation-childrens-email"), {
        target: { value: "john.doe@example.com" },
      });
      fireEvent.change(screen.getByTestId("relation-childrens-birthPlace"), {
        target: { value: "Paris" },
      });
    });
    const submitButton = screen.getByTestId("relation-childrens-submit");

    fireEvent.click(submitButton);

    await waitFor(() => {
      const callWith = createRelationMock.mock.calls[0][0];

      expect(callWith).toMatchObject(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          birthDate: "1990-01-01",
          denomination: "sonOf",
          phone: "0123456789",
          email: "john.doe@example.com",
          birthPlace: "Paris",
          countryOfBirth: "FR",
          maritalStatus: "single",
        })
      );
    });
  });

  it("should correctly delete a relation", async () => {
    render(
      <RelationTable
        relations={[
          {
            id: "1",
            denomination: "sonOf",
            firstName: "John",
            lastName: "Doe",
            birthDate: new Date("1990-01-01"),
            birthPlace: "Paris",
            nationality: "FR",
            countryOfBirth: "FR",
            maritalStatus: "single",
            phone: "0123456789",
            email: "john.doe@example.com",
          },
        ]}
        linkedRelations={[]}
        setShowEditModal={() => console.log("show edit modal")}
        onDelete={deleteRelationMock}
      />
    );
    await waitFor(async () => {
      const deleteButton = screen.getByTestId("relation-1-delete");
      fireEvent.click(deleteButton);
      // Simulate the confirmation dialog
      await waitFor(async () => {
        const deleteInput = screen.getByTestId("delete-dialog-input");
        fireEvent.change(deleteInput, {
          target: { value: "Supprimer" },
        });

        await waitFor(async () => {
          const confirmButton = screen.getByTestId("delete-dialog-button");
          fireEvent.click(confirmButton);
          expect(deleteRelationMock).toHaveBeenCalledWith("1");
        });
      });
    });
  });
});
