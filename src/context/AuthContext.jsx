import {
  createContext,
  useEffect,
  useState
} from "react";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD EXISTING SESSION
  ========================= */
  useEffect(() => {
    try {
      const savedStudent = localStorage.getItem(
        "messFinderCurrentUser"
      );

      const savedOwner = localStorage.getItem(
        "messFinderCurrentOwner"
      );

      if (savedOwner) {
        const owner = JSON.parse(savedOwner);

        setUser({
          ...owner,
          role: "owner"
        });
      } else if (savedStudent) {
        const student = JSON.parse(savedStudent);

        setUser({
          ...student,
          role: student.role || "student"
        });
      }
    } catch (error) {
      console.error(
        "Failed to load login session:",
        error
      );

      localStorage.removeItem(
        "messFinderCurrentUser"
      );

      localStorage.removeItem(
        "messFinderCurrentOwner"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     STUDENT REGISTER
  ========================= */
  const register = (userData) => {
    let savedUsers = [];

    try {
      savedUsers =
        JSON.parse(
          localStorage.getItem(
            "messFinderUsers"
          )
        ) || [];
    } catch {
      savedUsers = [];
    }

    const email = userData.email
      .trim()
      .toLowerCase();

    const emailExists = savedUsers.some(
      (item) =>
        item.email
          .trim()
          .toLowerCase() === email
    );

    if (emailExists) {
      return {
        success: false,
        message:
          "An account with this email already exists."
      };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name.trim(),
      email,
      password: userData.password,
      role: "student"
    };

    localStorage.setItem(
      "messFinderUsers",
      JSON.stringify([
        ...savedUsers,
        newUser
      ])
    );

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "student"
    };

    /*
      Only one account type should
      remain logged in at a time.
    */
    localStorage.removeItem(
      "messFinderCurrentOwner"
    );

    localStorage.setItem(
      "messFinderCurrentUser",
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);

    return {
      success: true
    };
  };

  /* =========================
     STUDENT LOGIN
  ========================= */
  const login = (email, password) => {
    let savedUsers = [];

    try {
      savedUsers =
        JSON.parse(
          localStorage.getItem(
            "messFinderUsers"
          )
        ) || [];
    } catch {
      savedUsers = [];
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const foundUser = savedUsers.find(
      (item) =>
        item.email
          .trim()
          .toLowerCase() ===
          cleanEmail &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message:
          "Invalid email or password."
      };
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: "student"
    };

    localStorage.removeItem(
      "messFinderCurrentOwner"
    );

    localStorage.setItem(
      "messFinderCurrentUser",
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);

    return {
      success: true
    };
  };

  /* =========================
     OWNER SESSION
  ========================= */
  const loginOwner = (ownerData) => {
    const sessionOwner = {
      id: ownerData.id,
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone || "",
      role: "owner"
    };

    /*
      Remove student session so
      both cannot be active together.
    */
    localStorage.removeItem(
      "messFinderCurrentUser"
    );

    localStorage.setItem(
      "messFinderCurrentOwner",
      JSON.stringify(sessionOwner)
    );

    setUser(sessionOwner);

    return {
      success: true
    };
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem(
      "messFinderCurrentUser"
    );

    localStorage.removeItem(
      "messFinderCurrentOwner"
    );

    setUser(null);
  };

  /* =========================
     AUTH HELPERS
  ========================= */
  const isStudent =
    user?.role === "student";

  const isOwner =
    user?.role === "owner";

  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        register,
        login,
        loginOwner,
        logout,

        isStudent,
        isOwner,
        isLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
