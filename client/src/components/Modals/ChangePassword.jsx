import { API } from "lib/api";
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function PasswordModal(props) {
  const { id } = useParams()
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  })

  const {old_password, new_password, confirm_new_password} = form;

  let { data: modalsUser } = useQuery("modalspasswordcache", async () => {
    const response = await API.get("/user/" + id)
    return response.data.data
  }) 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const changePassword = useMutation(async (e) => {
    try {
      e.preventDefault();

      const newPassword = new FormData();

      newPassword.append("old_password", form.old_password);
      newPassword.append("confirm_new_password", form.confirm_new_password);

      console.log("ini data body", newPassword)

      if (form.new_password !== form.confirm_new_password) {
        alert("Password does not match")
      }

      const response = await API.patch("/user/" + id + "/changePassword", newPassword)
      
      if (response !== null) {
        alert("Change Password Success")
        props.onHide();
      }
      
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <Modal {...props}
    size="md"
    aria-labelledby="contained-modal-title-vcenter" 
    centered>
      <Modal.Body className="m-3">
        <h1 className="text-center mt-3 mb-5 fw-bold">Change Password</h1>
        <Form onSubmit={(e) => changePassword.mutate(e)}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="old_password" className="fw-bold fs-4">
              Old Password
            </Form.Label>
            <Form.Control size="lg" type="password" id="old_password" className="bg-tertiary" name="old_password" onChange={handleChange} value={old_password}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="new_password" className="fw-bold fs-4">
              New Password
            </Form.Label>
            <Form.Control size="lg" type="password" id="new_password" className="bg-tertiary" name="new_password" onChange={handleChange} value={new_password}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="confirm_new_password" className="fw-bold fs-4">
              Confirm Password
            </Form.Label>
            <Form.Control size="lg" type="password" id="confirm_new_password" className="bg-tertiary" name="confirm_new_password" onChange={handleChange} value={confirm_new_password}/>
          </Form.Group>

          <Form.Group className="ms-auto mb-4">
            <Button size="lg" type="submit" className="mt-4 py-3 px-4 w-100">
              Change Password
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}