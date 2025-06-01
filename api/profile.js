const dbConnect = require('./_db');
const User = require('../models/User');

module.exports = async (req, res) => {
  await dbConnect();
  const { id } = req.query;

  const me = await User.findById(id);
  const matches = await User.find({ _id: { $ne: id }, identity: { $ne: me.identity } });
  res.json(matches);
};
