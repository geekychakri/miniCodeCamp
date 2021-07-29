import Link from "next/link";

export default function Custom404() {
  return (
    <div className="error-page">
      <img src="/images/404.svg" alt="" width="250" height="250" />
      <p className="error-page__msg">There's nothing to see here !</p>
      <Link href="/">
        <a className="error-page__btn">Go Home</a>
      </Link>
    </div>
  );
}
