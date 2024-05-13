import useFetch from "@hooks/use-fetch";
import { getUserInfo } from "@services/authentication";
import { useAuthStore } from "@stores/auth-store";
import { isCancelledError } from "@utils/assertions";
import { ComponentType, FC, useEffect } from "react";

const withUser = <TProps extends object>(
  WrappedComponent: ComponentType<TProps>
): FC<TProps> => {
  const WithUser = (props: TProps) => {
    const setUser = useAuthStore((state) => state.setUser);

    const { data: user, error } = useFetch(async (signal) => {
      return await getUserInfo(signal);
    });

    useEffect(() => { 
      if (error && !isCancelledError(error)) {
        setUser(null);
      } else {
        setUser(user);
      }
    }, [user, error, setUser]);

    return <WrappedComponent {...props} />;
  };

  return WithUser;
};

export default withUser;
