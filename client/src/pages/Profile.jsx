import React, { useContext, useState } from "react";
// import { Link } from "react-router-dom";

import css from "./Profile.module.css";
import { Image, Button } from "react-bootstrap";

import { HiUserCircle, HiMail } from "react-icons/hi";
import {
	MdLocationPin,
	MdLock,
	MdLocalPhone,
	MdPersonPinCircle,
} from "react-icons/md";
import { TbGenderBigender } from "react-icons/tb";
// import PassModal from "components/Modals/ChangePassword";
import Layout from "layouts/withSearchbar";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "lib/api";
import { AppContext } from "context/AppContext";
import PasswordModal from "components/Modals/ChangePassword";
import ImageModal from "components/Modals/ChangeImage";

export default function Profile() {
	const [state, dispatch] = useContext(AppContext)
	const [passwordModal, setPasswordModal] = useState(false)
	const [imageModal, setImageModal] = useState(false)
	let { id } = useParams();
	let { data: profile } = useQuery("profileCache", async () => {
		const response = await API.get("/user/" + id);
		return response.data.data;
	})

	return (
		<Layout className='bg-tertiary'>
			<div className=''>
				<div className={css.MaxWidth}>
					<div className={css.Card}>
						<div className='d-flex'>
							<div className={css.CardLeft}>
								<h1 className='mb-4 text-black'>
									<strong>Personal Info</strong>
								</h1>
								<div className='d-flex gap-3 align-items-center'>
									<HiUserCircle fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{profile?.fullname}</strong>
										<small>Full name</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<HiMail fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{profile?.email}</strong>
										<small>Email</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdLock fontSize={36} />
									<div className=''>
										<strong
											className={css.ListTitleTrigger} onClick={() => setPasswordModal(true)}
										>
											Change Password
										</strong>
										<small>Password</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdPersonPinCircle fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{profile?.listAs.name}</strong>
										<small>Status</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<TbGenderBigender fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{profile?.gender}</strong>
										<small>Gender</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdLocalPhone fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{profile?.phone}</strong>
										<small>Mobile Phone</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdLocationPin fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{profile?.address}</strong>
										<small>Address</small>
									</div>
								</div>
							</div>
							<div className={css.CardRight}>
								<div className={css.WrapperCardImage}>
										<Image
										className={css.CardImage}
										src={profile?.image}
										/>
								</div>
								<Button className={"btn btn-primary w-100 py-3 fw-bold fs-5"} onClick={() => setImageModal(true)}>
									Change Profile Picture
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<PasswordModal show={passwordModal} onHide={() => setPasswordModal(false)} />
			<ImageModal show={imageModal} onHide={() => setImageModal(false)} />
		</Layout>
	);
}
