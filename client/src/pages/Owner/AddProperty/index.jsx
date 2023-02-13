import React, { useState } from "react";
import Layout from "layouts/withoutSearchbar";
import { Form, Col, Button } from "react-bootstrap";

import css from "./index.module.css";
import { useMutation } from "react-query";
import { API } from "lib/api";
import { cities, period, nums, amen} from "../../../data/addproperty"

export default function AddProperty() {
	const [preview, setPreview] = useState(null); 
	const [form, setForm] = useState({
		name: "",
		city_id: "",
		address: "",
		price: "",
		type_rent: "",
		description: "",
		amenities: [],
		bedroom: "",
		bathroom: "",
		house_size: "",
		image: "",
	});

	const {name, city_id, address, price, type_rent, amenities, description, bedroom, bathroom, house_size, image} = form;

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
		});
		if (e.target.type === "file") {
			let url = URL.createObjectURL(e.target.files[0]);
			setPreview(url);
		}
	}

	const handleAmenities = (e) => {
		const { value, type, checked } = e.target;
		if (type === "checkbox") {
			let newAmenities = [...form.amenities];
			if (checked) {
				newAmenities.push(value)
			} else {
				newAmenities =newAmenities.filter((amen) => amen !== value)
			}
			setForm({...form, amenities: newAmenities})
		}
	}

	const handleSubmit = useMutation(async (e) => {
		try {
			e.preventDefault();

			const formData = new FormData();

			formData.append("name", form.name);
			formData.append("city_id", form.city_id);
			formData.append("address", form.address);
			formData.append("price", form.price);
			formData.append("type_rent", form.type_rent);
			formData.append("amenities", JSON.stringify(form.amenities));
			formData.append("bedroom", form.bedroom);
			formData.append("bathroom", form.bathroom);
			formData.append("description", form.description);
			formData.append("house_size", form.house_size);
			formData.append("image", form.image[0], form.image[0].name);

			const response = await API.post("/property", formData)

			if (response !== null) {
				alert("Successfully add property")
			}
			console.log("ini response", response)
		}catch (error) {
			console.log(error)
		}
	})

	return (
		<Layout className={css.BackgroundIndex}>
			<div className={css.MaxWidth}>
				<div className={css.Card}>
					<h2 className='fw-bold fs-1 my-4'>Add Property</h2>
					<Form className='fw-bold' onSubmit={(e) => handleSubmit.mutate(e)}>
						<Form.Group className='mb-3'>
							<Form.Label>Name Property</Form.Label>
							<Form.Control
								size='lg'
								id='name'
								name='name'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={name}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>City</Form.Label>
							<Form.Select
								size='lg'
								id='city_id'
								name='city_id'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={city_id}
							>
								<option>--Choose--</option>
								{cities.map((option, k) => (
									<option key={k} value={option.value}>{option.value}</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Address</Form.Label>
							<Form.Control
								size='lg'
								as='textarea'
								rows={3}
								id='address'
								name='address'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={address}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								size='lg'
								id='price'
								name='price'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={price}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Type of Rent</Form.Label>
							<Form.Select
								size='lg'
								id='type_rent'
								name='type_rent'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={type_rent}
							>
								<option>--Choose--</option>
								{period.map((option, k) => (
									<option key={k} value={option.value}>{option.value}</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								size='lg'
								as='textarea'
								rows={3}
								id='description'
								name='description'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={description}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Amenities</Form.Label>
							{amen.map((amenities, idk) => (
									<div key={idk} className='d-flex justify-content-between'>
										<Form.Label
											htmlFor={`amenities-${idk}`}
											className='text-secondary'
										>
											{amenities.name}
										</Form.Label>

										<Form.Check
											reverse
											name='amenities'
											type='checkbox'
											value={amenities.name}
											id={`amenities-${idk}`}
											// checked={amenitiesVal === amenities.name}
											onChange={handleAmenities}
										/>
									</div>
								))}
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Bed Room</Form.Label>
							<Form.Select
								size='lg'
								id='bedroom'
								name='bedroom'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={bedroom}
							>
								<option>--Choose--</option>
								{nums.map((option, k) => (
									<option key={k} value={option.value}>{option.value}</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Bath Room</Form.Label>
							<Form.Select
								size='lg'
								id='bathroom'
								name='bathroom'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={bathroom}
							>
								<option>--Choose--</option>
								{nums.map((option, k) => (
									<option key={k} value={option.value}>{option.value}</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>House Size</Form.Label>
							<Form.Control
								size='lg'
								id='house_size'
								name='house_size'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
								value={house_size}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
						<Form.Label htmlFor="image">Property Picture</Form.Label>
						<Form.Control 
						type="file"
						id="image"
						name="image"
						onChange={handleChange}
						size='lg'
						/>
      		</Form.Group>
					{preview && (
						<div>
							<img src={preview} style={{maxWidth: "150px", maxHeight: "150px", objectFit: "cover",}} alt={"ini alt"}/>
						</div>
					)}
						<Col className='d-flex mb-5 justify-content-end'>
							<Button size='lg' type='submit' className='click px-5 py-2'>
								Add Property
							</Button>
						</Col>
					</Form>
				</div>
			</div>
		</Layout>
	);
}
