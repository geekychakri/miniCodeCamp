import { useState, useEffect } from "react";

import { useClerk } from "@clerk/nextjs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { Lock, Unlock } from "react-feather";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const { user } = useClerk();
  const userName = user.fullName || user.firstName;
  // console.log(userName);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const downloadPDF = async () => {
    const existingPdfBytes = await fetch("/certificate.pdf").then((res) =>
      res.arrayBuffer()
    );
    console.log(existingPdfBytes);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    // const { width, height } = firstPage.getSize();

    firstPage.drawText(userName, {
      x: 300,
      y: 300,
      size: 40,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
    });

    const uri = await pdfDoc.saveAsBase64({ dataUri: true });
    saveAs(uri, "minicodecamp.pdf", { autoBom: true });
  };

  console.log("COURSES_LENGTH", courses.length);

  useEffect(() => {
    setLoading(true);
    const getUserDetails = async () => {
      try {
        const res = await fetch(`/api/user/${user.id}`);
        const data = await res.json();
        // console.log(data[0].courses);
        const completedCourses = data[0].courses.filter(
          (course) => course.completed === true
        );
        if (completedCourses.length === 8) {
          setDisabled(false);
          toast("Achievement Unlocked 🏆 ", {
            id: "certificate",
            duration: 5000,
            style: {
              fontSize: "1.2rem",
              fontWeight: "600",
              backgroundColor: "#212529",
              color: "#fff",
            },
          });
        }
        setCourses(completedCourses);
        setLoading(false);
        if (!completedCourses.length) {
          setNoData(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUserDetails();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__completed">
        <h1 className="dashboard__completed-heading">
          Completed <span style={{ color: "#ec3944" }}>Courses</span>
        </h1>
        {loading ? (
          <div className="spinner"></div>
        ) : noData ? (
          <p>You don't have any completed courses.</p>
        ) : (
          <div className="dashboard__completed-courses">
            {courses.map((course, index) => {
              return (
                <div key={index} className="dashboard__course">
                  <p className="dashboard__course-title">
                    {course.course.toUpperCase()}
                  </p>
                  <img
                    src={`/images/${course.course}.svg`}
                    alt={course.course}
                    width="50"
                    height="50"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="dashboard__certificate">
        <h1 className="dashboard__certificate-heading">
          <span className="dashboard__certificate-heading--main">
            Certificate of <span style={{ color: "#ec3944" }}>Completion</span>
          </span>
          <span className="dashboard__certificate-heading--sub">
            Complete all the courses and unlock certificate of completion.
          </span>
        </h1>
        <button
          className={`dashboard__certificate-btn ${disabled ? "disabled" : ""}`}
          disabled={disabled}
          onClick={downloadPDF}
        >
          <span className="dashboard__certificate-btn--text">
            Download Certificate
          </span>
          {disabled ? <Lock /> : <Unlock />}
        </button>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default Dashboard;
