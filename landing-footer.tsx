import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="zl-footer">
      <div className="zl-footer-inner">
        <p>
          ZUVRE is in its early phase. Capabilities labelled &ldquo;Planned&rdquo; are part of the design and are not
          yet available.
        </p>
        <nav aria-label="Footer">
          <a className="zl-link" href="#idea">The idea</a>
          <a className="zl-link" href="#ecosystem">Ecosystem</a>
          <Link className="zl-link" href="/login">Sign in</Link>
          <Link className="zl-link" href="/register">Enter ZUVRE</Link>
        </nav>
      </div>
    </footer>
  );
}
