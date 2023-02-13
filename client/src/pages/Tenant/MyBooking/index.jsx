import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "layouts/withSearchbar";


import { Button, Image, Table } from "react-bootstrap";
import logo from "assets/icons/Logo.svg";
import Stepper from "assets/icons/Stepper.svg";

import css from "./index.module.css";

import moment from "moment/moment";
import { useMutation, useQuery } from "react-query";
import { API } from "lib/api";

export default function MyBooking() {
		let { data: transaction } = useQuery("bookingcache", async () => {
			const response = await API.get("/myBooking");
			return response.data.data;
		});

		const handleSubmit = useMutation(async () => {
			try {
				const config = {
					headers: {
						Authorization: "Bearer " + localStorage.token,
						"Content-type": "application/json",
					},
				};

				const response = await API.get("/createMidtrans/" + transaction?.id, config)


				console.log("ini token lama",config, transaction?.id)

				const newToken = response.data.data.token 
				console.log("Ini data post response", newToken)
				
				window.snap.pay(newToken, {
					onSuccess: function (result) {
						console.log(result)
						alert("Yey kamu berhasil bayar")
					},
					onPending: function (result) {
						console.log(result)
						alert("Pembayaran mu masih pending")
					},
					onError: function (result) {
						console.log(result)
						alert("Pembayaran mu error")
					},
					onClose: function (result) {
						alert("Oyyyy Bayar dulu lah minimal")
					},
				});
			} catch (error) {
				console.log(error)
			}
		})

		// Post to api End
		useEffect(() => {
			const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

			const myMidtransClientKey = "SB-Mid-client-tyISZHDIMtfTG8B9";

			let scriptTag = document.createElement("script");
			scriptTag.src = midtransScriptUrl

			scriptTag.setAttribute("data-client-key", myMidtransClientKey)
			document.body.appendChild(scriptTag)

			return () => {
				document.body.removeChild(scriptTag)
			}
		}, [])

		// UseEffect here

	return (
		<Layout className={css.BackgroundIndex}>
			<div className=''>
				<div className={css.MaxWidth}>
					{transaction !== undefined ? (
						<div className={css.Card}>
							<div className='d-flex justify-content-between'>
								<div className={css.CardLeft}>
									<Image src={logo} alt='Logo' className={css.ImgLogo} />
									<div className='d-flex gap-3 align-items-center'>
										<div className='pe-4'>
											<h2>{transaction?.property.name}</h2>
											<p style={{ width: "19.5rem" }}>
												{transaction?.property.address}
											</p>
											<span className={css.Badge}>{transaction?.status}</span>
										</div>
										<div
											style={{ width: "14rem" }}
											className='d-flex align-items-center gap-4'
										>
											<div className=''>
												<Image src={Stepper} width={16} />
											</div>
											<div className='d-flex flex-column gap-4'>
												<div>
													<strong className='d-block'>Checkin</strong>
													<span className='text-secondary'>
														{moment(transaction?.checkin).format("DD MMMM YYYY")}
													</span>
												</div>
												<div>
													<strong className='d-block'>Checkout</strong>
													<span className='text-secondary'>
														{moment(transaction?.checkout).format("DD MMMM YYYY")}
													</span>
												</div>
											</div>
										</div>
										<div className=''>
											<div>
												<strong className='d-block'>Amenities</strong>
												<ul>
													{transaction?.property.amenities.map((x, k) => {
														return (
															<li key={k} className='text-secondary'>
																{x}
															</li>
														);
													})}
													{/* <li>Pet Allowed</li>
													<li>Furnished</li> */}
												</ul>
											</div>
											<div>
												<strong className='d-block'>Type of rent</strong>
												<span className='text-secondary ps-4'>
													{transaction?.property.type_rent}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className={css.CardRight}>
									<div>
										<h1 className='fw-bold'>Booking</h1>

										<p>
											<strong>{moment(transaction.checkin).format("dddd")}</strong>,{" "}
											{moment(transaction.checkin).format("DD MMMM YYYY")}
										</p>
									</div>
									<div className={css.WrapperCardImage}>
										<Image
											className={css.CardImage}
											src={process.env.PUBLIC_URL + "/img/Uploads/receipt.png"}
										/>
									</div>
									<small className='text-secondary'>Upload payment proof</small>
								</div>
							</div>
							<div className=''>
								<Table className='mt-4 mb-5'>
									<thead>
										<tr>
											<th>No</th>
											<th>Full Name</th>
											<th>Gender</th>
											<th>Phone</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr className='text-secondary'>
											<td>1</td>
											<td>{transaction?.user.fullname}</td>
											<td>{transaction?.user.gender}</td>
											<td>{transaction?.user.phone}</td>
											<td className='fw-semibold text-black'>
												Long Time Rent : 1 {transaction?.property.type_rent}
											</td>
										</tr>
										<tr>
											<td colSpan='4'></td>
											<td className='fw-semibold' style={{ width: "18rem" }}>
												total <span style={{ padding: "0 2.45rem" }}></span> :{" "}
												<span className='text-danger'>
													Rp. {transaction?.property.price} 
												</span>
											</td>
										</tr>
									</tbody>
								</Table>
							</div>
							<div className=''>
								<div className='d-flex justify-content-end'>
									<Button
										onClick={() => handleSubmit.mutate()}
										className={"btn btn-primary fw-bold fs-5 ms-auto"}
										style={{ padding: "1rem 6rem" }}
									>
										PAY
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div
							className='d-flex align-items-center justify-content-center'
							style={{ minHeight: "90vh" }}
						>
							<div className='text-center bg-white rounded-4 p-5 shadow'>
								<h2>Booking Kosong</h2>
								<p>Silahkan lakukan checkin terlebih dahulu</p>
								<Link to='/' className='btn btn-primary px-4 py-2 mt-2'>
									Kembali
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}
