export const useUser = () => {
  const getUserId = () => {
    return sessionStorage.getItem("userId");
  };
  const getUserName = () => {
    return sessionStorage.getItem("name");
  };
  const setUserId = (userId: string) => {
    sessionStorage.setItem("userId", userId);
  };

  const setUserName = (name: string) => {
    sessionStorage.setItem("name", name);
  };
  return {
    getUserId,
    getUserName,
    setUserId,
    setUserName,
  };
};
