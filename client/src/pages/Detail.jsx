import React, { useContext, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { Image, Button } from "react-bootstrap";

import { IoBed } from "react-icons/io5";
import { GiBathtub } from "react-icons/gi";

import { useQuery } from "react-query";
import { API } from "lib/api";
import css from "./Detail.module.css";

import Layout from "layouts/withoutSearchbar";
import OrderModal from "components/Modals/Detail";
import { AppContext } from "context/AppContext";

export default function Detail(props) {
	const [showModal, setShowModal] = useState(false);
	const { id } = useParams();
	const [state, dispatch] = useContext(AppContext);

	let { data: property } = useQuery("propertyCache", async () => {
		const response = await API.get("/property/" + id);
		return response.data.data;
	});

	const config = {
		headers: {
			Authorization: "Bearer " + localStorage.token
		}
	}

	let { data: myBooking } = useQuery("BookingCache", async () => {
		const response = await API.get("/myBooking", config)
		return response.data.data;
	})

	console.log("My Booking", myBooking)


	const showBooking = () => {
		setShowModal(true)
	}

	console.log("data showed", property);

	return (
		<Layout className={css.BackgroundIndex}>
			<div className={css.MaxWidth} style={{ marginTop: "4rem" }}>
				<div className='d-flex flex-column gap-3 w-100'>
					<div className={css.WrapperPrimaryImage}>
						<Image
							src={property?.image}
							className={css.PrimaryImage}
						/>
					</div>
					<div className='d-flex gap-3'>
						<div className={css.WrapperSubImage}>
							<Image
								src={property?.image}
								className={css.PrimaryImage}
							/>
						</div>
						<div className={css.WrapperSubImage}>
							<Image
								src={property?.image}
								className={css.PrimaryImage}
							/>
						</div>
						<div className={css.WrapperSubImage}>
							<span className={css.ImageMore}>+5</span>
							<Image
								src={property?.image}
								className={css.PrimaryImage}
							/>
						</div>
					</div>
				</div>
				<div className={css.WrappingBookingDesc}>
					<h1 className={css.BookingTitle}>{property?.name}</h1>
					<div className={css.BookingDesc}>
						<div>
							<h3 className='fw-bold'>
								{property?.price} / {property?.type_rent}
							</h3>
							<p className='text-secondary' style={{ width: "360px" }}>
								{property?.address}
							</p>
						</div>
						<div className=' d-flex gap-3'>
							<div className='fw-semibold'>
								<small className='text-secondary'>Bedrooms</small>
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.bedroom} <IoBed />
								</span>
							</div>
							<div className='fw-semibold'>
								<small className='text-secondary'>Bathrooms</small>{" "}
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.bathroom} <GiBathtub />
								</span>
							</div>
							<div className='fw-semibold'>
								<small className='text-secondary'>Area</small>{" "}
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.house_size} sqft
								</span>
							</div>
						</div>
					</div>
					<div className=''>
						<h3 className='fw-bold'>Description</h3>
						<p className='text-secondary'>{property?.description}</p>
					</div>
					<div className='d-flex w-100 justify-content-end'>
						{state.isLogin === true ? (
							<Button
							size='lg'
							variant='primary'
							className='px-5 py-2'
							onClick={showBooking}
						>
							BOOK NOW
						</Button>
						) : (
							<></>
						)}
						
					</div>
				</div>

				<OrderModal
					show={showModal}
					onHide={() => setShowModal(false)}
				/>
			</div>
		</Layout>
	);
}
