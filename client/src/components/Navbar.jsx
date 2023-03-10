import React, { useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaRegUser, FaRegCalendar } from "react-icons/fa";
import { TbHistory } from "react-icons/tb";
import { IoLogOut } from "react-icons/io5";
import { MdHomeWork } from "react-icons/md";

import { Image } from "react-bootstrap";

import { AppContext } from "context/AppContext";

// Components
import LoginModal from "components/Modals/Login";
import logo from "assets/icons/Logo.svg";
import RegisterModal from "components/Modals/Register";

import { API, setAuthToken } from "lib/api";

import {
	Navbar,
	Nav,
	Button,
	InputGroup,
	Form,
	Dropdown,
} from "react-bootstrap";
import css from "./Navbar.module.css";
import { useMutation, useQuery } from "react-query";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

export default function Header(props) {
	let navigate = useNavigate();
	const [loginModal, setLoginModal] = useState(false);
	const [registerModal, setRegisterModal] = useState(false);
	const [state, dispatch] = useContext(AppContext);

	const [form, setForm] = useState({name: "",});
	const { name } = form;

	let { data: usernavbar } = useQuery("navbaruser", async () => {
		const response = await API.get("/user/" + state.user.id);
		return response.data.data;
	})
	console.log("ini data user", usernavbar)

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = useMutation(async (e) => {
		try {
			e.preventDefault();

			// Configuration
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const response = await API.get("/singleFilter?property=" + name, config);

			if (response.data != null) {
				dispatch({
					type: "SEARCH",
					status: state.isLogin,
					isUser: state.user,
					payload: response.data.data,
				});
				console.log("house name", response.data.data)
			}
		} catch (error) {
			console.log(error);
		}
	});


	const isLogout = () => {
		dispatch({
			type: "LOGOUT",
		});
		navigate("/");
		alert("Logout Success, Bye????");
	};
	return (
		<>
			<Navbar style={props.style} expand='xxl' className={props.className}>
				<div className={css.MaxWidth}>
					<Navbar.Brand className={css.NavbarBrand}>
						<Link to='/'>
							<img src={logo} alt='' height={64} />
						</Link>
					</Navbar.Brand>

					<Navbar.Toggle
						aria-controls='basic-navbar-nav'
						className='ms-auto me-4'
					/>
					<Navbar.Collapse id='basic-navbar-nav' className=''>
						{props.useSearchBar !== false ? (
							<Form className='d-flex'>
								<InputGroup className={css.InputGroup}>
									<Form.Control
										size='lg'
										name='name'
										id='name'
										placeholder='Search'
										aria-label='Search'
										aria-describedby='basic-addon1'
										className='ms-4 border-0 border-end bg-tertiary'
										value={name}
										onChange={handleChange}
									/>
									<Button onClick={(e) => handleSubmit.mutate(e)} variant='outline-primary border-0 border-start bg-tertiary'>
										<HiMagnifyingGlass fontSize={24} strokeWidth={2} />
									</Button>
								</InputGroup>
							</Form>
						) : (
							<div></div>
						)}
						<Nav className='ms-auto px-4 d-flex gap-2'>
							{state.isLogin === true ? (
								<Dropdown className={css.Dropdown}>
									<Dropdown.Toggle className={css.Toggle}>
										{state.user.list_as_id === 1 ? (
											<Image
												className={css.ToggleImage}
												src={usernavbar?.image}
											/>
										) : (
											<Image
												className={css.ToggleImage}
												src={usernavbar?.image}
											/>
										)}
									</Dropdown.Toggle>

									<Dropdown.Menu align='end' className={css.DropdownMenu}>
										<Dropdown.Item
											as={Link}
											to={'/profile/' + state.user.id}
											className={css.DropMenu}
										>
											<div className='rounded-pill bg-tertiary'>
												<FaRegUser className='m-2 text-primary' />
											</div>
											<span className='fs-5 fw-medium'>Profile</span>
										</Dropdown.Item>
										{state.user.list_as_id === 1 ? (
											<Dropdown.Item
												as={Link}
												to='/addproperty'
												className={css.DropMenu}
											>
												<div className='rounded-pill bg-tertiary'>
													<MdHomeWork className='m-2 text-primary' />
												</div>
												<span className='fs-5 fw-medium'>Add Property</span>
											</Dropdown.Item>
										) : (
											<Dropdown.Item
												as={Link}
												to={'/mybooking'}
												className={css.DropMenu}
											>
												<div className='rounded-pill bg-tertiary'>
													<FaRegCalendar className='m-2 text-primary' />
												</div>
												<span className='fs-5 fw-medium'>My Booking</span>
											</Dropdown.Item>
										)}
										<Dropdown.Item
											as={Link}
											to='/history'
											className={css.DropMenu}
										>
											<div className='rounded-pill bg-tertiary'>
												<TbHistory className='m-2 text-primary' />
											</div>
											<span className='fs-5 fw-medium'>History</span>
										</Dropdown.Item>
										<Dropdown.Divider />
										<Dropdown.Item onClick={isLogout} className={css.DropMenu}>
											<div className='rounded-pill bg-tertiary'>
												<IoLogOut className='m-2 text-primary' />
											</div>
											<span className='fs-5 fw-medium'>Logout</span>
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							) : (
								<>
									<Button
										size='lg'
										variant='light'
										onClick={() => setLoginModal(true)}
									>
										Sign In
									</Button>
									<Button
										size='lg'
										variant='tertiary'
										onClick={() => setRegisterModal(true)}
									>
										Sign Up
									</Button>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</div>
			</Navbar>

			<LoginModal
				show={loginModal}
				toRegister={() => setRegisterModal(true)}
				onHide={() => setLoginModal(false)}
			/>
			<RegisterModal
				show={registerModal}
				toLogin={() => setLoginModal(true)}
				onHide={() => setRegisterModal(false)}
			/>
		</>
	);
}
