import { graphql, HttpResponse } from "msw";

import {
  AssetAffectationMutation,
  AssetCreationMutation,
  AssetDeletionMutation,
  AssetGroup,
  AssetUpdateGroupMutation,
  AssignHoldingsToBusinessMutation,
  AvailableTemplateUpdateMutation,
  BudgetCreationMutation,
  BudgetItemDeletionMutation,
  CampaignContractModificationMutation,
  CampaignCreationMutation,
  CampaignModificationMutation,
  CompanyCreationMutation,
  CompanyUploadMutation,
  ConnectionState,
  CreateCustomerMutation,
  CreateFilesFromTemplateMutation,
  CustomerAssetInvestmentUpdateMutation,
  CustomerConformityObjectivesUpdateMutation,
  CustomerCreationMultipleMutation,
  CustomerDeletionMutation,
  CustomerDetailsUpdateInput,
  CustomerInvestmentCreationMutation,
  CustomerRelationCreateMutation,
  CustomerRelationDeleteMutation,
  CustomerRelationsMutation,
  CustomerRelationUpdateMutation,
  CustomerUploadCreationMutation,
  DocumentAddMutation,
  DocumentCategoryCreationMutation,
  DocumentCategoryDeletionMutation,
  DocumentCategoryUpdateMutation,
  DocumentCustomTemplateCreationMutation,
  DocumentDeletionMutation,
  DocumentNotificationMutation,
  DocumentTemplateCreationMutation,
  DocumentTemplateDeleteMutation,
  DocumentTemplateUpdateMutation,
  DocumentUpdateMutation,
  EnvelopeAffectationMutation,
  EnvelopeCreationMutation,
  EnvelopeDeletionMutation,
  EnvelopeUpdateMutation,
  FileFromTemplateInput,
  GlobalAddWealthMutation,
  HoldingCreationMutation,
  HoldingUpdateMutation,
  InvestorProfileFormUpdateMutation,
  InvestorProfileUpdateMutation,
  InviteCustomerMutation,
  LoginMutation,
  LogoutMutation,
  ManagerCreationMutation,
  ManagerDeletionMutation,
  ManagerInviteAcceptMutation,
  ManagerInviteRejectMutation,
  NotifyDocumentStatusMutation,
  ProfileUpdateMutation,
  RequestFormFillingMutation,
  SignUpInviteMutation,
  SubmitPubliFormFillingMutation,
  SynchronizeConnectorMutation,
  SynchronizePowensConnectorMutation,
  UpdateCustomerInformationsDetailMutation,
  UpdateCustomerInformationsGeneralMutation,
  UpdateFiscalityMutation,
  UpdateLcbMutation,
} from "./../../types";
import {
  authentificatedManagerMock,
  budgetListMock,
  customerConformityObjectivesMock,
  customerMock,
  customerRelationMock,
  documentTemplateListMock,
  investorProfileFormMock,
  investorProfileMock,
} from "./mock";

// Login
export function loginMockMutation() {
  return graphql.mutation<LoginMutation>("Login", () => {
    const manager = authentificatedManagerMock();

    localStorage.setItem("session", "mock-cookie");
    return HttpResponse.json(
      {
        data: {
          authenticationFirebase: {
            id: "mock-id",
            manager,
          },
        },
      },
      {
        headers: {
          "Set-Cookie": "session=mock-cookie",
        },
      }
    );
  });
}

// ManagerCreation
export function managerCreationMockMutation() {
  return graphql.mutation<ManagerCreationMutation>("ManagerCreation", () => {
    return HttpResponse.json({
      data: {
        managerCreation: {
          id: "1",
        },
      },
    });
  });
}

// ManagerDelettion
export function managerDeletionMockMutation() {
  return graphql.mutation<ManagerDeletionMutation>("ManagerDeletion", () => {
    return HttpResponse.json({
      data: {
        managerDeletion: true,
      },
    });
  });
}

// Invitations
export function invitationsMockMutation() {
  return graphql.mutation<SignUpInviteMutation>("SignUpInvite", () => {
    return HttpResponse.json({
      data: {
        authenticationFirebase: {
          id: "mock-id",
          provider: "firebase",
          manager: authentificatedManagerMock(),
        },
        managerInviteAccept: {
          id: "1",
        },
      },
    });
  });
}

// DocumentNotification
export function documentNotificationMockMutation() {
  return graphql.mutation<DocumentNotificationMutation>(
    "DocumentNotification",
    () => {
      return HttpResponse.json(
        {
          data: {
            notifyDocumentStatus: [
              {
                id: "1",
              },
            ],
          },
        },
        {
          headers: {
            "Set-Cookie": "session=mock-cookie",
          },
        }
      );
    }
  );
}

// InviteCustomer
export function inviteCustomerMockMutation() {
  return graphql.mutation<InviteCustomerMutation>("InviteCustomer", () => {
    return HttpResponse.json({
      data: {
        inviteCustomer: {
          id: "1",
          email: "test@mail.com",
        },
      },
    });
  });
}

// CreateCustomer
export function createCustomerMockMutation() {
  return graphql.mutation<CreateCustomerMutation>(
    "CreateCustomer",
    ({ variables }) => {
      const name = variables.input.name ?? "";
      const hasError = name.includes("existing");
      if (hasError) {
        return HttpResponse.json({
          errors: [
            { message: "EXISTING_CUSTOMER" },
            { message: "EXISTING_ACCOUNT" },
          ],
          data: {
            customer: null,
          },
        });
      }
      return HttpResponse.json({
        data: {
          customer: {
            id: "1",
            name: "New customer",
          },
        },
      });
    }
  );
}

// Customer Informations Fiscality
export function customerFiscalityMockMutation() {
  return graphql.mutation<UpdateFiscalityMutation>("UpdateFiscality", () => {
    return HttpResponse.json({
      data: {
        customerFiscality: customerMock().fiscality,
      },
    });
  });
}

// Customer Conformity Objectives
export function customerConformityObjectivesyMockMutation() {
  return graphql.mutation<CustomerConformityObjectivesUpdateMutation>(
    "CustomerConformityObjectivesUpdate",
    () => {
      return HttpResponse.json({
        data: {
          conformityObjectivesUpdate: customerConformityObjectivesMock(),
        },
      });
    }
  );
}

// Customer general informations
export function customerGeneralInformationsMockMutation() {
  return graphql.mutation<UpdateCustomerInformationsGeneralMutation>(
    "UpdateCustomerInformationsGeneral",
    () => {
      return HttpResponse.json({
        data: {
          customerInformationsGeneral: customerMock().informations?.general,
        },
      });
    }
  );
}

// Mock  mutation UpdateLCB
export function updateLCBMockMutation() {
  return graphql.mutation<UpdateLcbMutation>("UpdateLCB", () => {
    return HttpResponse.json({
      data: {
        updateLCB: {
          legalRepresentative: "1",
          protectiveMeasure:
            "Habilitation Familiale Représentation Art.494-1 & suiv",
          professionalCategory: "Employés",
          heritage: 200000,
          income: 3000,
          comment: "test commentaire",
          classificationForce: "1",
          motivation: "bbbbbbbbbbbbbb",
        },
      },
    });
  });
}
// Customer details informations
export function customerDetailsInformationsMockMutation() {
  return graphql.mutation<UpdateCustomerInformationsDetailMutation>(
    "UpdateCustomerInformationsDetail",
    () => {
      return HttpResponse.json({
        data: {
          customerInformationsDetail: customerMock().informations?.details,
        },
      });
    }
  );
}

// Client details update
export function customerDetailsUpdateMockMutation() {
  return graphql.mutation<CustomerDetailsUpdateInput>(
    "CustomerDetailsUpdate",
    () => {
      return HttpResponse.json({
        data: {
          averageWealth: 1000,
          managedWealth: 1000,
        },
      });
    }
  );
}

// company creation
export function companyCreationMockMutation() {
  return graphql.mutation<CompanyCreationMutation>("CompanyCreation", () => {
    return HttpResponse.json({
      data: {
        companyCreation: {
          id: "1",
          name: "new Company",
        },
      },
    });
  });
}

// logout
export function logoutMockMutation() {
  return graphql.mutation<LogoutMutation>("Logout", () => {
    localStorage.removeItem("session");

    return HttpResponse.json(
      {
        data: {
          logoutAuthentication: {
            id: "auth_id",
          },
        },
      },
      {
        headers: {
          "Set-Cookie": "session=;",
        },
      }
    );
  });
}

export function assetCreationMockMutation() {
  return graphql.mutation<AssetCreationMutation>("AssetCreation", () => {
    return HttpResponse.json({
      data: {
        created: {
          id: "1",
          name: "Revolut",
        },
      },
    });
  });
}

export function assetUpdateGroupMockMutation() {
  return graphql.mutation<AssetUpdateGroupMutation>("AssetUpdateGroup", () => {
    return HttpResponse.json({
      data: {
        updated: [
          {
            id: "1",
            name: "assurance vie",
            group: AssetGroup.LifeInsuranceCapitalization,
            categoryName: "life_insurance",
          },
        ],
      },
    });
  });
}

export function customerUploadCreationMockMutation() {
  return graphql.mutation<CustomerUploadCreationMutation>(
    "CustomerUploadCreation",
    () => {
      return HttpResponse.json({
        data: {
          customerUpload: {
            expiration: "2021-09-30T00:00:00.000Z",
            files: [
              {
                url: "https://cgp-documents-preproduction.s3.fr-par.scw.cloud/companies/92524412-927d-4698-a8db-1c45ba0dfdc1/customers/11191473-94ca-492e-aeaa-557e38112f0b/uploads/image001.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=SCW84J28C2HN4D7FV0AG%2F20230724%2Ffr-par%2Fs3%2Faws4_request&X-Amz-Date=20230724T163505Z&X-Amz-Expires=86400&X-Amz-Signature=d8d4fa7e93bb0f0582f7ac393815dcf56852730301299c41d53dee4c6058cd5f&X-Amz-SignedHeaders=host&x-id=PutObject",
                name: "image001.jpg",
              },
            ],
          },
        },
      });
    }
  );
}

export function companyUploadMockMutation() {
  return graphql.mutation<CompanyUploadMutation>("CompanyUpload", () => {
    return HttpResponse.json({
      data: {
        companyUpload: {
          expiration: "2021-09-30T00:00:00.000Z",
          files: [
            {
              url: "https://cgp-documents-preproduction.s3.fr-par.scw.cloud/companies/92524412-927d-4698-a8db-1c45ba0dfdc1/customers/11191473-94ca-492e-aeaa-557e38112f0b/uploads/image001.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=SCW84J28C2HN4D7FV0AG%2F20230724%2Ffr-par%2Fs3%2Faws4_request&X-Amz-Date=20230724T163505Z&X-Amz-Expires=86400&X-Amz-Signature=d8d4fa7e93bb0f0582f7ac393815dcf56852730301299c41d53dee4c6058cd5f&X-Amz-SignedHeaders=host&x-id=PutObject",
              name: "image001.jpg",
            },
          ],
        },
      },
    });
  });
}

export function customerCreationMultipleMockMutation() {
  return graphql.mutation<CustomerCreationMultipleMutation>(
    "CustomerCreationMultiple",
    () => {
      return HttpResponse.json({
        data: {
          customerCreationMultiple: {
            id: "new_customerID",
            delayedUntil: "2021-09-30T00:00:00.000Z",
          },
        },
      });
    }
  );
}

export function envelopeCreationMockMutation() {
  return graphql.mutation<EnvelopeCreationMutation>("EnvelopeCreation", () => {
    return HttpResponse.json({
      data: {
        envelopeCreation: {
          id: "1",
          name: "new envelope",
        },
      },
    });
  });
}

export function envelopeAffectationMockMutation() {
  return graphql.mutation<EnvelopeAffectationMutation>(
    "EnvelopeAffectation",
    () => {
      return HttpResponse.json({
        data: {
          envelopeAffectation: {
            id: "1",
            name: "new envelope",
          },
        },
      });
    }
  );
}

// Campaign creation / update
export function campaignCreationMockMutation() {
  return graphql.mutation<CampaignCreationMutation>("CampaignCreation", () => {
    return HttpResponse.json({
      data: {
        campaignCreation: {
          id: "1",
          name: "new campaign",
        },
      },
    });
  });
}

export function campaignModificationMockMutation() {
  return graphql.mutation<CampaignModificationMutation>(
    "CampaignModification",
    () => {
      return HttpResponse.json({
        data: {
          campaignModification: {
            id: "1",
            name: "new campaign",
          },
        },
      });
    }
  );
}

export function campaignContractModificationMockMutation() {
  return graphql.mutation<CampaignContractModificationMutation>(
    "CampaignContractModification",
    () => {
      return HttpResponse.json({
        data: {
          campaignContractModification: {
            id: "1",
          },
        },
      });
    }
  );
}

export function investorProfileUpdateMockMutation() {
  return graphql.mutation<InvestorProfileUpdateMutation>(
    "InvestorProfileUpdate",
    () => {
      return HttpResponse.json({
        data: {
          investorProfileUpdate: investorProfileMock(),
        },
      });
    }
  );
}

export function budgetMockMutation() {
  return graphql.mutation<BudgetCreationMutation>("BudgetCreation", () => {
    const budget = budgetListMock()[0];
    return HttpResponse.json({
      data: {
        created: {
          name: budget.name,
          type: budget.type,
          libelle: null,
        },
      },
    });
  });
}

export function managerInviteAcceptMutationMock() {
  return graphql.mutation<ManagerInviteAcceptMutation>(
    "ManagerInviteAccept",
    () => {
      return HttpResponse.json({
        data: {
          managerInviteAccept: {
            id: "1",
          },
        },
      });
    }
  );
}

export function managerInviteRejectMutationMock() {
  return graphql.mutation<ManagerInviteRejectMutation>(
    "ManagerInviteReject",
    () => {
      return HttpResponse.json({
        data: {
          managerInviteReject: {
            id: "1",
          },
        },
      });
    }
  );
}

export function profileUpdateMutationMock() {
  return graphql.mutation<ProfileUpdateMutation>("ProfileUpdate", () => {
    const manager = authentificatedManagerMock();

    return HttpResponse.json({
      data: {
        profileUpdate: {
          id: manager.id,
        },
      },
    });
  });
}

export function budgetItemDeletionMutationMock() {
  return graphql.mutation<BudgetItemDeletionMutation>(
    "BudgetItemDeletion",
    () => {
      return HttpResponse.json({
        data: {
          budgetItemDeletion: true,
        },
      });
    }
  );
}

export function documentDeletionMutationMock() {
  return graphql.mutation<DocumentDeletionMutation>("DocumentDeletion", () => {
    return HttpResponse.json({
      data: {
        documentDeletion: true,
      },
    });
  });
}

export function customerDeletionMutationMock() {
  return graphql.mutation<CustomerDeletionMutation>("CustomerDeletion", () => {
    return HttpResponse.json({
      data: {
        customerDeletion: true,
      },
    });
  });
}

export function synchronizeAssetUnderManagementMockMutation() {
  return graphql.mutation<GlobalAddWealthMutation>("GlobalAddWealth", () => {
    return HttpResponse.json({
      data: {
        url: "https://fr.wikipedia.org/wiki/Roger_Claudel",
      },
    });
  });
}

export function assetAffectationMutationMock() {
  return graphql.mutation<AssetAffectationMutation>("AssetAffectation", () => {
    return HttpResponse.json({
      data: {
        assetsAffectation: [{ id: "test" }],
      },
    });
  });
}

export function notifyDocumentStatusMutationMock() {
  return graphql.mutation<NotifyDocumentStatusMutation>(
    "NotifyDocumentStatus",
    () => {
      return HttpResponse.json({
        data: {
          notifyDocumentStatus: [
            {
              id: "1",
            },
          ],
        },
      });
    }
  );
}

export function documentUpdateMutationMock() {
  return graphql.mutation<DocumentUpdateMutation>("DocumentUpdate", () => {
    return HttpResponse.json({
      data: {
        documentUpdate: {
          id: "1",
        },
      },
    });
  });
}

export function investorProfileFormUpdateMutationMock() {
  return graphql.mutation<InvestorProfileFormUpdateMutation>(
    "InvestorProfileFormUpdate",
    () => {
      return HttpResponse.json({
        data: {
          investorProfileFormUpdate: investorProfileFormMock(),
        },
      });
    }
  );
}

export function availableTemplateUpdateMutationMock() {
  return graphql.mutation<AvailableTemplateUpdateMutation>(
    "AvailableTemplateUpdate",
    () => {
      const documentTemplateList = documentTemplateListMock();
      return HttpResponse.json({
        data: {
          availableTemplateUpdate: documentTemplateList
            .filter((_, index) => index % 2 === 0)
            .map((template) => ({ id: template.id })),
        },
      });
    }
  );
}

export function assetDeletionMutationMock() {
  return graphql.mutation<AssetDeletionMutation>("AssetDeletion", () => {
    return HttpResponse.json({
      data: {
        assetDeletion: {
          id: "1",
        },
      },
    });
  });
}

export function createFilesFromTemplateMutationMock() {
  return graphql.mutation<CreateFilesFromTemplateMutation>(
    "CreateFilesFromTemplate",
    ({ variables }) => {
      const templates = variables.templates as FileFromTemplateInput[];

      return HttpResponse.json({
        data: {
          createFilesFromTemplate: templates.map((template) => ({
            ...template,
            name: `file from template ${template.id}`,
            url: "https:google.com",
            extension: "pdf",
          })),
        },
      });
    }
  );
}

export function customerInvestmentCreationMutationMock() {
  return graphql.mutation<CustomerInvestmentCreationMutation>(
    "CustomerInvestmentCreation",
    () => {
      return HttpResponse.json({
        data: {
          customerInvestmentCreation: {
            name: "new investment",
          },
        },
      });
    }
  );
}

export function synchronizeConnectorMutationMock() {
  return graphql.mutation<SynchronizeConnectorMutation>(
    "SynchronizeConnector",
    ({ variables }) => {
      const connectorID = parseInt(variables.connectorID);
      const index = connectorID ? connectorID - 1 : 0;
      const states = Object.values(ConnectionState);

      if (index === 3) {
        return HttpResponse.json({
          errors: [
            {
              message: "OTP_REQUIRED",
            },
          ],
        });
      }

      return HttpResponse.json({
        data: {
          synchronizeConnector: {
            connection: {
              id: variables.connectorID,
              state: states[index] as ConnectionState,
            },
            synchronization: {
              id: "1",
            },
          },
        },
      });
    }
  );
}

export function synchronizePowensConnectorMutation() {
  return graphql.mutation<SynchronizePowensConnectorMutation>(
    "SynchronizePowensConnector",
    () => {
      return HttpResponse.json({
        data: {
          synchronizePowensConnector: "https://google.com",
        },
      });
    }
  );
}

export function documentCategoryCreationMutation() {
  return graphql.mutation<DocumentCategoryCreationMutation>(
    "DocumentCategoryCreation",
    () => {
      return HttpResponse.json({
        data: {
          documentCategoryCreation: {
            name: "new category",
          },
        },
      });
    }
  );
}

export function envelopeUpdateMutation() {
  return graphql.mutation<EnvelopeUpdateMutation>("EnvelopeUpdate", () => {
    return HttpResponse.json({
      data: {
        envelopeUpdate: {
          id: "Updated envelop",
        },
      },
    });
  });
}

export function envelopeDeletionMutation() {
  return graphql.mutation<EnvelopeDeletionMutation>("EnvelopeDeletion", () => {
    return HttpResponse.json({
      data: {
        envelopeDeletion: {
          id: "Deleted envelop",
        },
      },
    });
  });
}

export function documentAddMutation() {
  return graphql.mutation<DocumentAddMutation>("DocumentAdd", () => {
    return HttpResponse.json({
      data: {
        documentAdd: {
          id: "new category",
        },
      },
    });
  });
}

export function documentCategoryUpdateMutation() {
  return graphql.mutation<DocumentCategoryUpdateMutation>(
    "DocumentCategoryUpdate",
    () => {
      return HttpResponse.json({
        data: {
          documentCategoryUpdate: {
            name: "updated category",
          },
        },
      });
    }
  );
}

export function documentCategoryDeletionMutation() {
  return graphql.mutation<DocumentCategoryDeletionMutation>(
    "DocumentCategoryDeletion",
    () => {
      return HttpResponse.json({
        data: {
          documentCategoryDeletion: {
            name: "Deleted category",
          },
        },
      });
    }
  );
}

export function customerAssetInvestmentUpdateMutation() {
  return graphql.mutation<CustomerAssetInvestmentUpdateMutation>(
    "CustomerAssetInvestmentUpdate",
    () => {
      return HttpResponse.json({
        data: {
          customerAssetInvestmentUpdate: [
            {
              id: "1",
            },
          ],
        },
      });
    }
  );
}
export function sendInvestorProfileFormToCustomerMutation() {
  return graphql.mutation<RequestFormFillingMutation>(
    "RequestFormFilling",
    () => {
      return HttpResponse.json({
        data: {
          requestFormFilling: {
            id: "1",
          },
        },
      });
    }
  );
}
export function SubmitPubliFormFillingMutationFn() {
  return graphql.mutation<SubmitPubliFormFillingMutation>(
    "SubmitPubliFormFilling",
    () => {
      return HttpResponse.json({
        data: {
          formFilling: {
            id: "1",
          },
        },
      });
    }
  );
}
export function holdingCreationMutation() {
  return graphql.mutation<HoldingCreationMutation>("HoldingCreation", () => {
    return HttpResponse.json({
      data: {
        holdingCreation: {
          id: "1",
        },
      },
    });
  });
}

export function holdingUpdateMutation() {
  return graphql.mutation<HoldingUpdateMutation>("HoldingUpdate", () => {
    return HttpResponse.json({
      data: {
        holdingUpdate: {
          id: "1",
        },
      },
    });
  });
}

// export function HoldingCompanyCreateOrUpdateMutation() {
//   return graphql.mutation<HoldingCompanyCreateOrUpdateMutation>(
//     "HoldingCompanyCreateOrUpdate",
//     () => {
//       return HttpResponse.json({
//         data: }({
//           holdingCompanyCreateOrUpdate: {
//             id: "1",
//           },
//         })
//       );
//     }
//   );
// }

export function customerRelationCreateMutation() {
  return graphql.mutation<CustomerRelationCreateMutation>(
    "CustomerRelationCreate",
    () => {
      return HttpResponse.json({
        data: {
          customerRelationCreate: {
            ...customerRelationMock()[0],
          },
        },
      });
    }
  );
}

export function customerRelationUpdateMutation() {
  return graphql.mutation<CustomerRelationUpdateMutation>(
    "CustomerRelationUpdate",
    () => {
      return HttpResponse.json({
        data: {
          customerRelationUpdate: {
            ...customerRelationMock()[0],
          },
        },
      });
    }
  );
}

export function customerRelationDeleteMutation() {
  return graphql.mutation<CustomerRelationDeleteMutation>(
    "CustomerRelationDelete",
    () => {
      return HttpResponse.json({
        data: {
          customerRelationDelete: {
            ...customerRelationMock()[0],
          },
        },
      });
    }
  );
}

export function customerRelationsMutation() {
  return graphql.mutation<CustomerRelationsMutation>(
    "customerRelations",
    () => {
      return HttpResponse.json({
        data: {
          customerRelations: {
            ...customerRelationMock()[0],
          },
        },
      });
    }
  );
}

export function assignHoldingsToBusinessMutation() {
  return graphql.mutation<AssignHoldingsToBusinessMutation>(
    "AssignHoldingsToCompany",
    () => {
      return HttpResponse.json({
        data: {
          assignHoldingsToBusiness: [
            {
              id: "1",
              name: "new company",
            },
          ],
        },
      });
    }
  );
}

export function documentCustomTemplateCreationMockMutation() {
  return graphql.mutation<DocumentCustomTemplateCreationMutation>(
    "DocumentCustomTemplateCreation",
    () => {
      return HttpResponse.json({
        data: {
          documentCustomTemplateCreation: {
            ...documentTemplateListMock()[0],
          },
        },
      });
    }
  );
}

export function documentTemplateCreationMockMutation() {
  return graphql.mutation<DocumentTemplateCreationMutation>(
    "DocumentTemplateCreation",
    () => {
      return HttpResponse.json({
        data: {
          documentTemplateCreation: {
            ...documentTemplateListMock()[1],
          },
        },
      });
    }
  );
}

export function documentTemplateUpdateMockMutation() {
  return graphql.mutation<DocumentTemplateUpdateMutation>(
    "DocumentTemplateUpdate",
    () => {
      const documentTemplateList = documentTemplateListMock();
      return HttpResponse.json({
        data: {
          documentTemplateUpdate: {
            id: documentTemplateList[0].id,
          },
        },
      });
    }
  );
}

export function documentTemplateDeletionMockMutation() {
  return graphql.mutation<DocumentTemplateDeleteMutation>(
    "DocumentTemplateDelete",
    () => {
      return HttpResponse.json({
        data: {
          documentTemplateDeletion: true,
        },
      });
    }
  );
}
