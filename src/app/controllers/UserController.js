import User from '../schemas/User';
import md5 from 'crypto-js/md5';
import { $lte } from 'mongoose';

class UserController {
  async index(req, res) {
    const users = await User.find()
      .populate('role')
      .sort({ createdAt: -1 });

    const userFormatted = users.map(
      ({ _id, firstName, lastName, email, role, createdAt }) => ({
        _id,
        firstName,
        lastName,
        email,
        role,
        createdAt,
        role,
      })
    );

    return res.json(
      userFormatted.filter(
        ({ role }) => !role?.level || role?.level <= req.role
      )
    );
  }

  async store(req, res) {
    try {
      const password = md5(req.body.password);

      const user = await User.create({ ...req.body, password });

      return res.json(user);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async update(req, res) {
    const { userId } = req.params;
    const password = md5(req.body.password);

    try {
      const user = await User.findById(userId);
      await user.update({ ...req.body, password });

      return res.json(user);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async delete(req, res) {
    const { userId } = req.params;

    await User.findOneAndDelete(userId);

    return res.send();
  }
}

export default new UserController();
