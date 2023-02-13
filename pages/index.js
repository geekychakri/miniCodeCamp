import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import Router from "next/router";

import { useClerk } from "@clerk/nextjs";
import { ArrowRight } from "react-feather";

import courseList from "./../data/course-list.json";
import YouTubeIcon from "./../public/images/youtube.png";

function Home() {
  const { user } = useClerk();

  useEffect(() => {
    if (user) {
      Router.push("/courses");
    }
  }, []);

  return (
    <>
      <header className="header">
        <div className="header__text-box">
          <div>
            <h1 className="heading-primary">
              <span className="heading-primary--main">
                Code. Build. Repeat.
              </span>
              <span className="heading-primary--sub">
                Learn to code for free.
              </span>
            </h1>
            <Link href="/courses">
              <a className="btn-main">
                <span style={{ marginRight: "10px" }}>Start Learning</span>
                <ArrowRight size={32} />
              </a>
            </Link>
          </div>
        </div>

        <div className="header__img-box">
          <Image
            src={YouTubeIcon}
            placeholder="blur"
            alt="YouTube"
            width="300"
            height="300"
          />
        </div>
      </header>

      <section className="section-one">
        <h2 className="heading-secondary">
          Why mini<span style={{ color: "#ec3944" }}>CodeCamp</span> ?
        </h2>
        <div className="section-grid one">
          <div className="card">
            <Image src="/images/youtube.png" alt="" width="100" height="100" />
            <p className="card__text">Curated Crash Courses.</p>
          </div>

          <div className="card">
            <Image src="/images/calendar.png" alt="" width="100" height="100" />
            <p className="card__text">Learn At Your Own Pace.</p>
          </div>

          <div className="card">
            <Image src="/images/trophy.png" alt="" width="100" height="100" />
            <p className="card__text">Earn a Certificate.</p>
          </div>
        </div>
      </section>

      <section className="section-two">
        <h2 className="heading-secondary">
          What You'll <span style={{ color: "#ec3944" }}>Learn</span>
        </h2>
        <div className="section-grid two">
          {courseList.map((course) => {
            return (
              <div className="card" key={course.id}>
                <img
                  src={`/images/${course.image}`}
                  alt={course.image}
                  width="100"
                  height="100"
                />
                <p className="card__text">{course.name}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section-three">
        <Image
          src="/images/hashnode.png"
          width="250"
          height="250"
          alt="hashnode"
        />
        <div className="section__text-box">
          <p className="section-three__text">
            Connect with the global{" "}
            <span style={{ color: "#2962ff", fontWeight: "700" }}>DEV</span>{" "}
            community.
          </p>
          <a
            href="https://hashnode.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="section-three__link"
          >
            Join hashnode
          </a>
        </div>
      </section>
      <footer className="footer">
        <p>
          Made with{" "}
          <span role="img" aria-label="love" style={{ color: "#ec3944" }}>
            ❤️️
          </span>{" "}
          By{" "}
          <a
            href="https://twitter.com/geekychakri"
            target="_blank"
            rel="noopener noreferrer"
            className="creator"
          >
            Chakri
          </a>
        </p>
      </footer>
    </>
  );
}

export default Home;
