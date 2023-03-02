import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API } from "lib/api";
import { useQuery } from "react-query";

import { toCurrency } from "lib/Currency";
import { useContext } from "react";
import { AppContext } from "context/AppContext";

export default function CardProperties(props) {
	const [state, dispatch] = useContext(AppContext);

	let { data: properties } = useQuery("propertiesCache", async () => {
		const response = await API.get("/properties");
		return response.data.data;
	});

	let property = state.city
	console.log("city", property)
	if (property === undefined) {
		if (state.filter === undefined) {
			property = properties;
		} else {
			property = state.filter;
		}
	}

	return (
		<>
			{property?.map((room, k) => {
				return (
					<Link
						to={"/detail/" + room.id}
						key={k}
						className='w-100'
						style={{ textDecoration: "none" }}
					>
						<Card className={props.className}>
							<div className='position-absolute mt-3 ms-3 d-flex gap-1'>
								{room.amenities.map((amenity, k) => (
									<span key={k} className='px-3 py-1 bg-white rounded-2 fs-6'>
										{amenity}
									</span>
								))}
							</div>
							<Card.Img
								variant='top'
								className='p-2'
								src={
									room.image
								}
								style={{width: "20rem", height: "20rem"}}
							/>
							<Card.Body>
								<Card.Title>
									<strong>
										{room.name}
									</strong>
								</Card.Title>
								<Card.Title>
									<strong>
										{toCurrency(room.price)} / {room.type_rent}
									</strong>
								</Card.Title>
								<Card.Subtitle className='mb-2'>
									{room.bedroom} Beds, {room.bathroom} Bath, {room.house_size} Sqft
								</Card.Subtitle>
								<Card.Text>
									{room.address}, {room.city.name}
								</Card.Text>
							</Card.Body>
						</Card>
					</Link>
				);
			})}
		</>
	);
}
