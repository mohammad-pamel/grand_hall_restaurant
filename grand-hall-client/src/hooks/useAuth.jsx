import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext/AuthContext";
// import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
