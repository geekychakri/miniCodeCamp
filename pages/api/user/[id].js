import { requireAuth } from "@clerk/nextjs/api";

import { connect } from "../../../utils/db";
import User from "../../../models/User";

connect();

export default requireAuth(async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      console.log("GET REQUEST 🚀");
      {
        try {
          const user = await User.find({ user: req.query.id });
          // console.log(user);
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json({ msg: "Something went wrong" });
        }
      }
      break;
    case "PUT": {
      console.log("PUT REQUEST 🚀");
      try {
        const { course, completed } = req.body;
        console.log(req.body);
        const user = await User.findOneAndUpdate(
          { user: req.query.id },
          {
            $push: { courses: { course, completed } },
          },
          {
            new: true,
          }
        );
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ msg: "Something went wrong" });
      }
      break;
    }
    default:
      res.status(200).json({});
      break;
  }
});
