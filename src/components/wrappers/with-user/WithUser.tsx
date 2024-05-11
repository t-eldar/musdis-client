import withUser from "@hoc/with-user";

type WithUserProps = {
  children: JSX.Element;
};

const WithUser = withUser(({ children }: WithUserProps) => {
  return children;
});

export default WithUser;
