import React from "react";
import LayoutStore from "layouts/withSearchbar";
// import DataRooms from "data/rooms";
import Card from "components/CardProperties";
import { API } from "lib/api";
import { useQuery } from "react-query";
// import css from "home.module.css";
import Sidebar from "components/SidebarStore";

import css from "./index.module.css";

export default function Home() {

	let { data: properties } = useQuery("propertiesCache", async () => {
		const response = await API.get("/properties");
		return response.data.data;
	});

	console.log("data showed", properties);



	return (
		<LayoutStore className={css.BackgroundIndex}>
			<div className={css.MaxWidth}>
				<div>
					<Sidebar className={css.SideItem} />
				</div>
				<div>
					<section className={css.MainWithSidebar}>
						<div className='p-lg-4'>
							<div className={css.RoomsDisplay}>
								<Card Rooms={properties} className={css.RoomLink} />
							</div>
						</div>
					</section>
				</div>
			</div>
		</LayoutStore>
	);
}
