import { graphql, HttpResponse } from "msw";

const middlewares = [
  graphql.operation(async ({ operationName }) => {
    const isPublicQueriesName = ["Login", "SignUpInvite"].includes(
      operationName
    );

    const isAuth = localStorage.getItem("session");

    if (!isPublicQueriesName && !isAuth) {
      return HttpResponse.json({
        errors: [
          {
            message: "Access denied",
            positions: [1, 92],
          },
        ],
      });
    }
  }),
];

export default middlewares;
