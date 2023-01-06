import axios from "axios";
import { setAlert } from "./alert";
import {
	ACCOUNT_DELETED,
	CLEAR_PROFILE,
	GET_PROFILE,
	GET_PROFILES,
	GET_REPOS,
	PROFILE_ERROR,
	UPDATE_PROFILE,
} from "./types";

// Get current user profiles
export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get("http://localhost:5000/api/profile/me");

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
	dispatch({ type: CLEAR_PROFILE });
	try {
		const res = await axios.get("http://localhost:5000/api/profile");

		dispatch({
			type: GET_PROFILES,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Get Profile by ID
export const getProfileById = (userId) => async (dispatch) => {
	try {
		const res = await axios.get(
			`http://localhost:5000/api/profile/user/${userId}`
		);

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get Github Repos
export const getGithubRepos = (username) => async (dispatch) => {
	try {
		const res = await axios.get(
			`http://localhost:5000/api/profile/github/${username}`
		);

		dispatch({
			type: GET_REPOS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//create or update a profile
export const createProfile =
	(formData, navigate, edit = false) =>
	async (dispatch) => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			const res = await axios.post(
				"http://localhost:5000/api/profile",
				formData,
				config
			);
			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			});
			dispatch(
				setAlert(edit ? "Profile Updated" : "Profile Created", "success")
			);
			if (!edit) {
				navigate("/dashboard");
			}
		} catch (err) {
			const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((error) => {
					dispatch(setAlert(error.msg, "danger"));
				});
			}
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
	};

//Add Experience
export const addExperience = (formData, navigate) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const res = await axios.put(
			"http://localhost:5000/api/profile/experience",
			formData,
			config
		);
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});
		dispatch(setAlert("Experience Added", "success"));
		navigate("/dashboard");
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, "danger"));
			});
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add Education
export const addEducation = (formData, navigate) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const res = await axios.put(
			"http://localhost:5000/api/profile/education",
			formData,
			config
		);
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});
		dispatch(setAlert("Education Added", "success"));
		navigate("/dashboard");
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, "danger"));
			});
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Delete experience
export const deleteExperience = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(
			`http://localhost:5000/api/profile/experience/${id}`
		);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});
		dispatch(setAlert("Experience Removed", "success"));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Delete education
export const deleteEducation = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(
			`http://localhost:5000/api/profile/education/${id}`
		);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});
		dispatch(setAlert("Education Removed", "success"));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Delete Account and Profile
export const deleteAccount = (id) => async (dispatch) => {
	if (window.confirm("Are you sure? This can NOT be undone !!")) {
		try {
			await axios.delete(`http://localhost:5000/api/profile/`);

			dispatch({
				type: CLEAR_PROFILE,
			});

			dispatch({
				type: ACCOUNT_DELETED,
			});

			dispatch(setAlert("Your account has been permanently deleted"));
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
	}
};
