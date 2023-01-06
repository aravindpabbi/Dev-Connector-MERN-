import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
//Redux logic
import { Provider } from "react-redux";
import store from "./store";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Navbar />
				<Alert />
				<Routes>
					<Route path='/' element={<Landing />} />
					<Route path='register' element={<Register />} />
					<Route path='login' element={<Login />} />
					<Route path='profiles' element={<Profiles />} />
					<Route path='profile/:id' element={<Profile />} />

					<Route
						path='/dashboard'
						element={<PrivateRoute component={Dashboard} />}
					/>
					<Route
						path='/create-profile'
						element={<PrivateRoute component={CreateProfile} />}
					/>
					<Route
						path='/edit-profile'
						element={<PrivateRoute component={EditProfile} />}
					/>
					<Route
						path='/add-experience'
						element={<PrivateRoute component={AddExperience} />}
					/>
					<Route
						path='/add-education'
						element={<PrivateRoute component={AddEducation} />}
					/>
					<Route path='/posts' element={<PrivateRoute component={Posts} />} />
					<Route
						path='/posts/:id'
						element={<PrivateRoute component={Post} />}
					/>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
