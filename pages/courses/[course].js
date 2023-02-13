import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/router";

import { useClerk } from "@clerk/nextjs";
import ReactPlayer from "react-player/youtube";
import toast, { Toaster } from "react-hot-toast";
import { ExternalLink } from "react-feather";

import { connect } from "./../../utils/db";
import Course from "./../../models/Course";
import Quiz from "../../components/Quiz";

const toastStyles = {
  fontSize: "1.2rem",
  fontWeight: "600",
  backgroundColor: "#212529",
  color: "#fff",
};

function CoursePage({ course }) {
  const router = useRouter();
  // console.log(router.query.course);
  // console.log(course.resources);

  const { user } = useClerk();
  const [checkCourseCompleted, setCheckCourseCompleted] = useState(false);

  const quizRef = useRef(null);

  // console.log("CHECK_COURSE_COMPLETED", checkCourseCompleted);

  const onEnded = async () => {
    quizRef.current.scrollIntoView({ behavior: "smooth" });

    if (checkCourseCompleted) {
      return;
    }
    toast("Yay! Completed 🎉", {
      duration: 2000,
      style: toastStyles,
    });
    console.log("Ended");
    try {
      const res = await fetch("/api/updateCourse", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: router.query.course,
          completed: true,
        }),
      });
      console.log("UPDATED_RESPONSE", res);
      setCheckCourseCompleted(true);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      toast.error(err.message, {
        id: "error",
        style: toastStyles,
      });
    }
    // console.log("ENDED 💥");
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await fetch(`/api/user/${user.id}`);
        const data = await res.json();

        //If user visits course page without clicking start button and there's no user exists CREATE a user doc.
        if (!data.length) {
          const res = await fetch(`/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: user.id,
              courses: [{ course: router.query.course, completed: false }],
            }),
          });

          if (!res.ok) {
            throw new Error("Something went wrong");
          }
          return;
        }

        console.log("DATA", data);

        const courseObj = data[0].courses.find(
          (course) => course.course === router.query.course
        );

        // Check the course object and find whether it's completed or not
        if (courseObj) {
          setCheckCourseCompleted(courseObj.completed);
        }

        console.log("COURSE_OBJ", courseObj);

        //If user visits course page without clicking the button UPDATE the User doc with the course.
        if (courseObj?.course !== router.query.course) {
          const res = await fetch(`/api/user/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              course: router.query.course,
              completed: false,
            }),
          });
          if (!res.ok) {
            throw new Error("Something went wrong");
          }
          console.log("WITHOUT_CLICK_BTN", res);
        }
      } catch (err) {
        toast.error(err.message, {
          style: toastStyles,
        });
      }
    };
    getUserDetails();
  }, []);

  return (
    <>
      <Script src="/scripts/smoothscroll.min.js" strategy="beforeInteractive" />
      <div className="course">
        <div className="course__player">
          <ReactPlayer
            onError={() => console.log("Something Went Wrong")}
            url={course.ytURL}
            className="react-player"
            controls={true}
            onEnded={onEnded}
            light={true}
          />
        </div>

        <div className="course__resources">
          <h1 className="course__resources-heading">Resources</h1>
          <div className="course__resources-list">
            {course.resources.map((resource, index) => (
              <a
                href={resource.url}
                rel="noopener noreferrer"
                target="_blank"
                className="course__resources-link"
                key={index}
              >
                <span className="course__resources-text">{resource.name}</span>
                <ExternalLink />
              </a>
            ))}
          </div>
        </div>
        <div className="course__quiz" ref={quizRef}>
          <div className="course__quiz-header">
            <h1 className="course__quiz-heading">Quiz</h1>
          </div>
          <Quiz questions={course.quiz} />
        </div>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  connect();
  const courses = await Course.find();
  const slugs = JSON.parse(JSON.stringify(courses)).map(
    (course) => course.course
  );
  const paths = slugs.map((slug) => {
    return {
      params: { course: slug },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  connect();
  const courseID = context.params.course;
  const courses = await Course.find();
  //   console.log(courses);
  const course = JSON.parse(JSON.stringify(courses)).find(
    (course) => course.course === courseID
  );
  return {
    props: {
      course,
    },
  };
};

export default CoursePage;
