import { loginRedirectPath } from "@/util/api/loginredirect";
import Link from "next/link";
import styles from "./styles.module.css";
import { usePathname, useSearchParams } from "next/navigation";

const LoginButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <>
      <Link
        href={loginRedirectPath("login", pathname, searchParams)}
        className={`btn btn-primary ${styles.userlogin}`}
        role="button"
      >
        Login
      </Link>
    </>
  );
};

const RegisterButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <>
      <Link
        href={loginRedirectPath("register", pathname, searchParams)}
        className={`btn btn-primary ${styles.userlogin}`}
        role="button"
      >
        Register
      </Link>
    </>
  );
};
export { LoginButton, RegisterButton };
