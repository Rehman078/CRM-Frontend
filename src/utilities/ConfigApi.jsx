export const getConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const role = user?.role;

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Role: role || "",
    },
  };
};
