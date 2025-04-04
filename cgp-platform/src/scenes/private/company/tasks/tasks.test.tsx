import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  exportTasksMock,
  mockRouterSetup,
  resetRouterMocks,
} from "../../../../mocks/test/react-query.setup";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../tests/test-utils";
import { Header } from "./components/Header";

describe("Tasks", () => {
  beforeEach(() => {
    mockRouterSetup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetRouterMocks();
  });

  it("Click on the download button should call export tasks", async () => {
    render(
      <Header
        count={0}
        late={0}
        t={(key: string) => key}
        setAddDialogVisible={() => console.log("setAddDialogVisible")}
        exportTasks={exportTasksMock}
        isExportingTasks={false}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("export-tasks-button")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("export-tasks-button"));
      expect(exportTasksMock).toHaveBeenCalled();
    });
  });
});
