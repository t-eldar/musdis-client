import useFetch from "@hooks/use-fetch";
import { getUserInfo } from "@services/authentication";
import { useAuthStore } from "@stores/auth-store";
import { ComponentType, FC, useEffect } from "react";

const withUser = <TProps extends object>(
  WrappedComponent: ComponentType<TProps>
): FC<TProps> => {
  const WithUser = (props: TProps) => {
    const setUser = useAuthStore((state) => state.setUser);

    const { data: user } = useFetch(async (signal) => {
      return await getUserInfo(signal);
    });

    useEffect(() => {
      setUser(user || null);
    }, [user, setUser]);

    return <WrappedComponent {...props} />;
  };

  return WithUser;
};

export default withUser;
