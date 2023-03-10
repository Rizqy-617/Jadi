import React from "react";
import Navbar from "../../components/Navbar";

// import { Container } from "react-bootstrap";
export default function Store(props) {
	return (
		<div className={props.className}>
			<Navbar
				style={{ zIndex: "20" }}
				useSearchBar={false}
				className={"bg-body fixed-top z-2"}
			/>
			{props.children}
		</div>
	);
}
