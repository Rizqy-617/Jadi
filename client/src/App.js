import React, { useContext, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import Home from "pages";
import Profile from "pages/Profile";
import Detail from "pages/Detail";

import MyBooking from "pages/Tenant/MyBooking";
import History from "pages/Tenant/History";

import OwnerHome from "pages/Owner/Home";
import AddProperty from "pages/Owner/AddProperty";
import OwnerHistory from "pages/Owner/History";

import IsLogin from "lib/PrivateRoute/IsLogin"
import { API, setAuthToken } from "lib/api";
import { AppContext } from "context/AppContext";


if (localStorage.token) {
	setAuthToken(localStorage.token);
}

export default function App() {

	const [state, dispatch] = useContext(AppContext);

	useEffect(() => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
	}, [state]);
	console.log(state);

	const checkUser = async () => {
		try {
			const response = await API.get('/check-auth');

			if (response.data.code === 404) {
				return dispatch({
					type: 'AUTH_ERROR',
				});
			}

			let payload = response.data.data;
			payload.token = localStorage.token;

			dispatch({
				type: 'SIGNIN',
				payload,
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (localStorage.token) {
			checkUser();
		}
	}, []);
	return (
		<Routes>
			{state.isLogin === true && state.user.list_as_id === 1 ? (

				<>
					<Route path="/" element={<OwnerHome />} />
					<Route path="/profile/:id" element={<Profile />} />
					<Route path="/addproperty" element={<AddProperty />} />
					<Route path="/history" element={<OwnerHistory />} />
				</>
			) : (
				<>
					<Route path="/" element={<Home />} />
					<Route path="/detail/:id" element={<Detail />} />
					<Route path="/" element={<IsLogin />} >
						<Route path="/profile/:id" element={<Profile />} />
						<Route path="/mybooking" element={<MyBooking />} />
						<Route path="/history" element={<History />} />
					</Route>
				</>
			)}
		</Routes>
	);
}

