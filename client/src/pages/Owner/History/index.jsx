import React from "react";
import { Link } from "react-router-dom";
import Layout from "layouts/withoutSearchbar";

import { Image, Table } from "react-bootstrap";
import logo from "assets/icons/Logo.svg";
import Stepper from "assets/icons/Stepper.svg";

import css from "./index.module.css";

import moment from "moment/moment";
import { useQuery } from "react-query";
import { API } from "lib/api";
export default function History() {
	let {data: transactiondata } = useQuery("transactiondata", async () => {
		const config = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    };
		const response = await API.get("/allTransaction", config);
		return response.data.data;
	});

	console.log(transactiondata)
	return (
		<Layout className={css.BackgroundIndex}>
			<div className=''>
				<div className={css.MaxWidth}>
					{transactiondata ? (
						<>
							{transactiondata?.map((b, i) => {
								return (
									<div key={i} className={css.Card}>
										<div className='d-flex justify-content-between'>
											<div className={css.CardLeft}>
												<Image src={logo} alt='Logo' className={css.ImgLogo} />
												<div className='d-flex gap-3 align-items-center'>
													<div className='pe-4'>
														<h2>{b?.property.name}</h2>
														<p style={{ width: "19.5rem" }}>{b?.property.address}</p>
														{b?.status === "pending" ? (
															<span className={css.BadgeWarning}>
																Waiting Approve
															</span>
														) : (
															<span className={css.BadgeSuccess}>Approve</span>
														)}
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
																{moment(b?.checkin).format("DD MMMM YYYY")}
																</span>
															</div>
															<div>
																<strong className='d-block'>Checkout</strong>
																<span className='text-secondary'>
																{moment(b?.checkout).format("DD MMMM YYYY")}
																</span>
															</div>
														</div>
													</div>
													<div className=''>
														<div>
															<strong className='d-block'>Amenities</strong>
															<ul>
																{b?.property.amenities.map((x, k) => {
																	return (
																		<li key={k} className='text-secondary'>
																			{x}
																		</li>
																	);
																})}
															</ul>
														</div>
														<div>
															<strong className='d-block'>Type of rent</strong>
															<span className='text-secondary ps-4'>
																{b?.property.type_rent}
															</span>
														</div>
													</div>
												</div>
											</div>
											<div className={css.CardRight}>
												<div>
													<h1 className='fw-bold'>INVOICE</h1>

													<p>
														<strong>{moment(b?.checkin).format("dddd")}</strong>,{" "}
														{moment(b?.checkin).format("DD MM YYYY")}
													</p>
												</div>
												<div className={css.WrapperCardImage}>
													<Image
														className={css.CardImage}
														src={
															process.env.PUBLIC_URL +
															"/img/Uploads/qr-code.png"
														}
													/>
												</div>
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
														<td>{b?.user.fullname}</td>
														<td>{b?.user.gender}</td>
														<td>{b?.user.phone}</td>
														<td className='fw-semibold text-black'>
															Long Time Rent : 1 {b?.property.type_rent}
														</td>
													</tr>
													<tr>
														<td colSpan='4'></td>
														<td className='fw-semibold' style={{ width: "18rem" }}>
															total <span style={{ padding: "0 2.45rem" }}></span> :{" "}
															<span className='text-danger'>
																Rp. {b?.property.price} 
															</span>
														</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</div>
								);
							})}
						</>
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
