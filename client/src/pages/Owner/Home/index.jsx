import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { RxMagnifyingGlass } from "react-icons/rx";

import Layout from "layouts/withoutSearchbar";
// import VerifyModal from "components/Modals/VerifyTransaction";
import css from "./index.module.css";
import { useQuery } from "react-query";
import { API } from "lib/api";

export default function Home() {
	let {data: transactiondata } = useQuery("transactiondatacache", async () => {
		const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
		const response = await API.get("/allTransaction", config);
		console.log(response)
		return response.data.data;
	});

	let id;
	return (
		<Layout className={css.BackgroundIndex}>
			<div className={css.MaxWidth}>
				<div className={css.Card}>
					<h2 className='fw-bold fs-1 my-4'>Incoming Transaction</h2>
					<Table hover size='lg' className={css.TableData}>
						<thead>
							<tr>
								<th>No</th>
								<th>Users</th>
								<th>Type of Rent</th>
								<th>Bukti Transfer</th>
								<th>Status Payment</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{transactiondata ? (
								<>
									{transactiondata?.map((b, i) => {
										id = i;
										return (
											<tr key={i}>
												<td>{i + 1}</td>
												<td>{b.user.username}</td>
												<td>{b.property.type_rent}</td>
												<td>bni.jpg</td>
												{b.status === "pending" ? (
													<td className={css.TextWarning}>Pending</td>
												) : (
													<>
														{b.status === "success" ? (
															<td className={css.TextSuccess}>Approved</td>
														) : (
															<td className={css.TextDanger}>Cancel</td>
														)}
													</>
												)}
												<td>
													<span>
														<RxMagnifyingGlass className={css.IconButton} />
													</span>
												</td>
											</tr>
										);
									})}

								</>
							) : (
								<tr>
									{" "}
									<td colSpan={6} className='text-center'>
										-
									</td>
								</tr>
							)}
						</tbody>
					</Table>
				</div>
			</div>
		</Layout>
	);
}
