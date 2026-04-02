type NavProps = {
  active: "home" | "about" | "profile";
};

const linkClass = (name: NavProps["active"], active: NavProps["active"]) => (name === active ? "nav-link nav-link-active" : "nav-link");

export default function Nav({ active }: NavProps) {
  return (
    <nav className="nav">
      <a className={linkClass("home", active)} href="/">
        Home
      </a>
      <a className={linkClass("about", active)} href="/?tab=about">
        About
      </a>
      <a className={linkClass("profile", active)} href="/?tab=profile">
        Profile
      </a>
    </nav>
  );
}
