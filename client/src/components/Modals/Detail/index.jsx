import React, { useState } from "react";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

import css from "./index.module.css";
import { useMutation, useQuery } from "react-query";
import { API } from "lib/api";

const OrderModal = (props) => {
	const navigate = useNavigate();
  const { id } = useParams();
	
	let { data: propertydata } = useQuery("propertymodalcache", async () => {
		const response = await API.get("/property/" + id)
		return response.data.data;
	})

	const [checkin, setCheckin] = useState(moment().format('YYYY-MM-DD'));
	const [checkout, setCheckout] = useState(moment().add(1, propertydata?.type_rent).format('YYYY-MM-DD'));

  const handleChange = (e) => {
    setCheckin(e.target.value);
		if (propertydata?.type_rent === "Year") {
			setCheckout(moment(e.target.value).add(1, 'year').format('YYYY-MM-DD'));
		} else if (propertydata?.type_rent === "Month") {
			setCheckout(moment(e.target.value).add(1, 'month').format('YYYY-MM-DD'));
		} else if (propertydata?.type_rent === "Day") {
			setCheckout(moment(e.target.value).add(1, 'day').format('YYYY-MM-DD'));
		}
  };

	const dataTransaction = {
		property_id: propertydata?.id,
		checkin: checkin,
		checkout: checkout,
		status: "waiting payment",
		total: propertydata?.price,
	};

  const handleSubmit = useMutation(async (e) => {
    try {
			e.preventDefault();

			const config = {
				headers: {
					Authorization: "Bearer " + localStorage.token
				},
			};
			console.log("ini data add transaction", config)

			const response = await API.post("/transaction", dataTransaction, config)


			if (response.data != null) {
				setCheckin("");
				setCheckout("");
				props.onHide();
				navigate("/mybooking")
			}
		} catch (error) {
			console.log(error)
		}
  }); 

	return (
		<Modal {...props} size='md' centered>
			<Modal.Body className={css.Modal}>
				<h2 className='text-center mt-3 mb-3 fw-bold'>
					How long will you stay
				</h2>
				<Form className={css.Form} onSubmit={(e) => handleSubmit.mutate(e)}>
					<Form.Group className='mb-3'>
						<Form.Label htmlFor='checkin' className='fw-bold fs-4'>
							Check-in
						</Form.Label>
						<Form.Control
							autoFocus
							size='lg'
							type='date'
							id='checkin'
							placeholder='Checkin'
							className='bg-tertiary'
							name='checkin'
							onChange={handleChange}
						/>
					</Form.Group>
					
					<h4 className="fw-bold mb-4">Check-out</h4>
					<span className="py-3 px-4 mb-3 rounded bg-success text-white fw-bold">{moment(checkout).format("dddd, DD MMMM YYYY")}</span>

					<Form.Group className='ms-auto mb-4'>
						<Button
							size='lg'
							type='submit'
							className='mt-4 py-3 px-4 w-100'
						>
							Order
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default OrderModal;