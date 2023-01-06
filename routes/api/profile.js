const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

const { check, validationResult, body } = require("express-validator");
const axios = require("axios");
const config = require("config");

// @route   GET api/profile/me
// @desc    Get Current User Profile
// @access  Public
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			"user",
			["name", "avatar"]
		);

		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for the user" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
	"/",
	[
		auth,
		[
			check("status", "Status is required").not().isEmpty(),
			check("skills", "Skills is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(500).json({ errors: errors.array() });
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			twitter,
			instagram,
			linkedin,
			facebook,
		} = req.body;

		const profileData = {};

		profileData.user = req.user.id;
		if (company) profileData.company = company;
		if (website) profileData.website = website;
		if (location) profileData.location = location;
		if (bio) profileData.bio = bio;
		if (status) profileData.status = status;
		if (githubusername) profileData.githubusername = githubusername;
		if (skills) {
			profileData.skills = skills.split(",").map((skill) => skill.trim());
		}

		profileData.social = {};
		if (youtube) profileData.social.youtube = youtube;
		if (twitter) profileData.social.twitter = twitter;
		if (instagram) profileData.social.instagram = instagram;
		if (linkedin) profileData.social.linkedin = linkedin;
		if (facebook) profileData.social.facebook = facebook;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileData },
					{ new: true }
				);
				return res.json(profile);
			}

			profile = new Profile(profileData);
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route   Get api/profile
// @desc    Get all profile
// @access  Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   Get api/profile/user/:userId
// @desc    Get profile by user id
// @access  Public
router.get("/user/:userId", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.userId,
		}).populate("user", ["name", "avatar"]);

		if (!profile) {
			return res.status(400).json({ msg: "Profile not found" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == "ObjectId") {
			return res.status(400).json({ msg: "Profile not found" });
		}
		res.status(500).send("Server Error");
	}
});

// @route   DELETE api/profile
// @desc    Delete profile user and posts
// @access  Private
router.delete("/", auth, async (req, res) => {
	try {
		await Post.deleteMany({ user: req.user.id });

		await Profile.findOneAndRemove({ user: req.user.id });

		await User.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: "User deleted" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
	"/experience",
	[
		auth,
		[
			check("title", "Title is required").not().isEmpty(),
			check("company", "Company is required").not().isEmpty(),
			check("from", "From Date is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route   DELETE api/profile/experience/:expid
// @desc    Delete a experience from profile
// @access  Private
router.delete("/experience/:expId", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.expId);

		profile.experience.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
	"/education",
	[
		auth,
		[
			check("school", "School is required").not().isEmpty(),
			check("degree", "Degree is required").not().isEmpty(),
			check("fieldofstudy", "Field of study is required").not().isEmpty(),
			check("from", "From Date is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(newEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route   DELETE api/profile/education/:eduId
// @desc    Delete a education from profile
// @access  Private
router.delete("/education/:eduId", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.eduId);

		profile.education.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get("/github/:username", async (req, res) => {
	try {
		const result = await axios.get(
			`https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&
		client_id=${config.get("githubClientID")}&client_secret=${config.get(
				"githubSecret"
			)}`,
			{
				headers: {
					"user-agent": "node.js",
				},
			}
		);
		if (result.status != 200) {
			return res.status(404).json({ msg: "No github profile not found" });
		}
		res.json(result.data);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});
module.exports = router;
