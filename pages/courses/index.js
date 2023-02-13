import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import { CheckCircle, Youtube } from "react-feather";
import toast from "react-hot-toast";

import courseList from "../../data/course-list";

const toastStyles = {
  fontSize: "1.2rem",
  fontWeight: "600",
  backgroundColor: "#212529",
  color: "#fff",
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useClerk();

  console.log({userId: user.id});
  console.log(courses);

  const addCourse = async (slug) => {
    toast.loading("Loading...", {
      id: "loading",
      style: toastStyles,
    });
    try {
      const res = await fetch(`/api/user/${user.id}`);
      const data = await res.json();
      if (data.length) {
        // If course already exists in courses array just return
        if (data[0].courses.some((course) => course.course === slug)) {
          router.push(`/courses/${slug}`);
          console.log("COURSE ALREADY EXISTS !");
          toast.remove("loading");
          return;
        }
        console.log("UPDATED COURSES"); 
        // Update the courses array by adding a new course.
        const res = await fetch(`/api/user/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course: slug,
            completed: false,
          }),
        });
        console.log("COURSE_RESPONSE", res);
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        router.push(`/courses/${slug}`);
        toast.remove("loading");
        return;
      }
    } catch (err) {
      toast.remove("loading");
      toast.error(err.message, {
        id: "error",
        style: toastStyles,
      });
      return;
    }
    // If the user doc doesn't exists create a new User doc.
    try {
      console.log("New user doc");
      const res = await fetch(`/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
          courses: [{ course: slug, completed: false }],
        }),
      });
      console.log(res);
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      router.push(`/courses/${slug}`);
      toast.remove("loading");
    } catch (err) {
      toast.remove("loading");
      toast.error(err.message, {
        id: "error",
        style: toastStyles,
      });
    }
  };

  const BtnText = ({ text }) => (
    <span style={{ marginRight: "10px" }}>{text}</span>
  );

  useEffect(() => {
    setLoading(true);
    const getUserDetails = async () => {
      try {
        const res = await fetch(`/api/user/${user.id}`);
        const data = await res.json();
        // Check if data is empty
        if (!data.length) {
          setLoading(false);
          return;
        }
        setCourses(data[0]?.courses);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  return (
    <div className="courses">
      <div className="courses__text-box">
        <h1 className="courses__heading">
          <span className="courses__heading--main">Web</span>
          <span className="courses__heading--sub"> Development</span>
        </h1>
      </div>
      <div className="courses__section-grid">
        {courseList.map((course) => {
          return (
            <div className="courses__card" key={course.id}>
              <div className="courses__card-header">
                <img
                  src={`/images/${course.image}`}
                  alt={course.image}
                  width="60"
                  height="60"
                  className="courses__card-logo"
                />
                <span className="courses__card-title">{course.name}</span>
              </div>

              <div className="courses__card-body">{course.description}</div>

              <div className="courses__card-footer">
                <button
                  className="courses__card-btn completed"
                  onClick={() => {
                    addCourse(course.slug);
                  }}
                >
                  {loading ? (
                    <div className="spinner light"></div>
                  ) : courses
                      ?.filter((item) => item.course === course.slug)
                      .some((item) => item.completed === true) ? (
                    <>
                      <BtnText text="Completed" />
                      <CheckCircle size={32} />
                    </>
                  ) : courses?.some((item) => item.course === course.slug) ? (
                    <>
                      <BtnText text="Resume Course" />
                      <Youtube size={38} />
                    </>
                  ) : (
                    <>
                      <BtnText text="Start Course" />
                      <Youtube size={38} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;
