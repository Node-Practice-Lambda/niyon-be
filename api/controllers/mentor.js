/* eslint-disable no-dupe-keys */
const models = require('../../database/models');
const response = require('../helpers/response');

module.exports = {
  async getAllMentors(req, res) {
    try {
      const mentors = await models.Mentors.findAll({
        attributes: ['user_id', 'industry_id', 'location_id'],
        include: [
          {
            model: models.Industries,
            attributes: ['industry_name'],
            as: 'industry'
          },
          {
            model: models.Users,
            attributes: [
              'first_name',
              'last_name',
              'biography',
              'profile_picture'
            ],
            as: 'user',
            required: true,
            include: [
              {
                model: models.Locations,
                attributes: ['country_name', 'city_name'],
                as: 'location'
              }
            ]
          }
        ]
      });
      if (mentors) {
        return response.success(res, 200, mentors);
      }
      return response.error(res, 404, 'Could not find all Mentors');
    } catch (error) {
      return response.error(res, 500, error.message);
    }
  },

  async makeUserMentor(req, res) {
    try {
      const { locationId, industryId } = req.body;
      const { username } = req.params;
      const user = await models.Users.findOne({
        attributes: ['id'],
        where: { username }
      });
      const userId = user.dataValues.id;
      // const token = {
      //   id: 2,
      //   username: 'john1'
      // };
      // const jwtToken = await jwt.generateToken(token);
      // console.log(jwtToken);
      if (userId) {
        const mentor = await models.Mentors.create({
          user_id: userId,
          location_id: locationId,
          industry_id: industryId
        });
        if (mentor) {
          return response.success(res, 201, mentor);
        }
        return response.error(res, 404, 'Could not create Mentor');
      }
      return response.error(res, 404, `user ${username} does not exist`);
    } catch (error) {
      return response.error(res, 500, error.message);
    }
  }
};
