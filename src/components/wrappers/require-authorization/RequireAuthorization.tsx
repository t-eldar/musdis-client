import { withRequiredAuthorization } from "@hoc/with-required-authorization/";
import { PropsWithChildren } from "react";

const RequireAuthorization = withRequiredAuthorization(
  ({ children }: PropsWithChildren) => {
    return children;
  }
);

export default RequireAuthorization;
