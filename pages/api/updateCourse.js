import { requireAuth } from "@clerk/nextjs/api";
import { connect } from "../../utils/db";
import User from "../../models/User";

connect();

export default requireAuth(async (req, res) => {
  // console.log(req.body);
  try {
    const course = await User.updateOne(
      {
        user: req.auth.userId,
        "courses.course": req.body.course,
      },
      {
        $set: {
          "courses.$.completed": req.body.completed,
        },
      }
    );
    console.log(course);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
