import React, { useState } from "react";
import { Alert, Button, Modal, Form } from "react-bootstrap";
import { useMutation } from "react-query";
import { API } from "lib/api";

import css from "./Register.module.css";

const RegisterModal = (props) => {
	// const [isRegistered, setIsRegistered] = useState([]);

	const [message, setMessage] = useState(null);
	const [preview, setPreview] = useState(null); 
	const [form, setForm] = useState({
		fullname: "",
		username: "",
		email: "",
		password: "",
		list_as_id: "",
		gender: "",
		phone: "",
		address: "",
		image: "",
	});

	const {
		fullname,
		username,
		email,
		password,
		list_as_id,
		gender,
		phone,
		address,
		image,
	} = form;

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
		});
		if (e.target.type === "file") {
			let url = URL.createObjectURL(e.target.files[0]);
			setPreview(url);
		}
	};


	const handleSubmit = useMutation(async (e) => {
		try {
			e.preventDefault();
	
			const formData = new FormData();

			formData.append("fullname", form.fullname);
			formData.append("username", form.username);
			formData.append("email", form.email);
			formData.append("password", form.password);
			formData.append("list_as_id", form.list_as_id);
			formData.append("gender", form.gender);
			formData.append("phone", form.phone);
			formData.append("address", form.address);
			formData.append("image", form.image[0], form.image[0].name);

			// Insert data user to database
			const response = await API.post("/register", formData);
			console.log(response)

			// Notification
			if (response.data != null) {
				alert("Successfully Sign Up");
				props.onHide();
				props.toLogin();
			} else {
				const alert = (
					<Alert variant='danger' className='py-1'>
						Sign Up Failed{<br></br>}Field Cannot be Empty!!!
					</Alert>
				);
				setMessage(alert);
			}
		} catch (error) {
			const alert = (
				<Alert variant='danger' className='py-1'>
					Sign Up Failed{<br></br>}Field Cannot be Empty!!!
				</Alert>
			);
			setMessage(alert);
			console.log(error);
		}
	});

	const ListAsData = [{ value: "Tenant" }, { value: "Owner" }];
	const GenderData = [{ value: "Male" }, { value: "Female" }];

	return (
		<Modal
			{...props}
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Body className={css.Modal}>
				<h1 className='text-center mt-3 mb-5 fw-bold'>Sign up</h1>
				<Form className={css.Form} onSubmit={(e) => handleSubmit.mutate(e)}>
					<Form.Group className='mb-3'>
						<Form.Label htmlFor='fullname' className='fw-bold fs-4'>
							Full Name
						</Form.Label>
						<Form.Control
							autoFocus
							size='lg'
							type='text'
							id='fullname'
							placeholder='Fullname'
							className='bg-tertiary'
							name='fullname'
							onChange={handleChange}
							value={fullname}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='username' className='fw-bold fs-4'>
							Username
						</Form.Label>
						<Form.Control
							size='lg'
							type='text'
							id='username'
							placeholder='Username'
							className='bg-tertiary'
							name='username'
							onChange={handleChange}
							value={username}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='email' className='fw-bold fs-4'>
							Email
						</Form.Label>
						<Form.Control
							size='lg'
							type='email'
							id='email'
							placeholder='Email'
							className='bg-tertiary'
							name='email'
							onChange={handleChange}
							value={email}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='password' className='fw-bold fs-4'>
							Password
						</Form.Label>
						<Form.Control
							size='lg'
							type='password'
							id='password'
							placeholder='Password'
							className='bg-tertiary'
							name='password'
							onChange={handleChange}
							value={password}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='list' className='fw-bold fs-4'>
							List As
						</Form.Label>
						<Form.Select
							size='lg'
							id='list'
							className='bg-tertiary'
							name='list_as_id'
							onChange={handleChange}
							value={list_as_id}
						>
							<option>--Choose--</option>
							{ListAsData.map((option, k) => (
								<option key={k} value={option.value}>
									{option.value}
								</option>
							))}
						</Form.Select>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='gender' className='fw-bold fs-4'>
							Gender
						</Form.Label>
						<Form.Select
							size='lg'
							id='gender'
							className='bg-tertiary'
							name='gender'
							onChange={handleChange}
							value={gender}
						>
							<option>--Choose--</option>
							{GenderData.map((option, k) => (
								<option key={k} value={option.value}>
									{option.value}
								</option>
							))}
						</Form.Select>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='phone' className='fw-bold fs-4'>
							Phone
						</Form.Label>
						<Form.Control
							size='lg'
							type='text'
							id='phone'
							placeholder='Phone'
							className='bg-tertiary'
							name='phone'
							onChange={handleChange}
							value={phone}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='address' className='fw-bold fs-4'>
							Address
						</Form.Label>
						<Form.Control
							size='lg'
							as='textarea'
							rows='4'
							id='address'
							placeholder='Address'
							name='address'
							// value={isRegistered.address}
							className='bg-tertiary'
							onChange={handleChange}
							value={address}
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="image">Profile Picture</Form.Label>
						<Form.Control 
						type="file"
						id="image"
						name="image"
						onChange={handleChange}
						/>
      		</Form.Group>
					{preview && (
						<div>
							<img src={preview} style={{maxWidth: "150px", maxHeight: "150px", objectFit: "cover",}} alt={"ini alt"}/>
						</div>
					)}

					<Form.Group className='ms-auto mb-4'>
						<Button
							size='lg'
							type='submit'
							className='mt-4 py-3 px-4 w-100'
							// onClick={RegistSubmit}
						>
							Sign up
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default RegisterModal;
