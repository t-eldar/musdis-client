import { useAuthStore } from "@stores/auth-store";
import { ComponentType, FC } from "react";
import { Navigate } from "react-router-dom";

const withRequiredAuthorization = <TProps extends object>(
  WrappedComponent: ComponentType<TProps>
): FC<TProps> => {
  const WithUser = (props: TProps) => {
    const user = useAuthStore((state) => state.user);
    console.log(user);
    
    if (user === null) {
      return <Navigate to="/sign-in" />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithUser;
};

export default withRequiredAuthorization;
