import { requireSession } from "@clerk/clerk-sdk-node";

import { connect } from "../../../utils/db";
import User from "../../../models/User";

connect();

export default requireSession(async (req, res) => {
  console.log("POST REQUEST 🚀");
  console.log(req.body);
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
