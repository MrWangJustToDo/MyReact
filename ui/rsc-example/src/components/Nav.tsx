type NavProps = {
  active: "home" | "about" | "profile";
};

export default function Nav({ active }: NavProps) {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        MyReact
      </a>
      <nav className="nav" aria-label="Primary">
        <a className={active === "home" ? "nav-link is-active" : "nav-link"} href="/">
          Demo
        </a>
        <a className={active === "about" ? "nav-link is-active" : "nav-link"} href="/about">
          About
        </a>
        <a className={active === "profile" ? "nav-link is-active" : "nav-link"} href="/profile/guest">
          Profile
        </a>
      </nav>
    </header>
  );
}
