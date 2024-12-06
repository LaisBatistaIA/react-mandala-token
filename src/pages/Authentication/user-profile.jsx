import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";

// import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";

// Formik Validation
import { useFormik } from "formik";
import * as Yup from "yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, getProfile, resetProfileFlag } from "/src/store/actions";

const UserProfile = (props) => {
  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [idx, setidx] = useState(1);
  const [emailVerified, setemailVerified] = useState(false);

  const ProfileProperties = createSelector(
    (state) => state.Profile,
    (profile) => ({
      currentUser: profile.user,
      error: profile.error,
      success: profile.success,
    }),
  );

  const { currentUser, error, success } = useSelector(ProfileProperties);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
        setemail(obj.email);
        setidx(obj.uid);
        setemailVerified(obj.emailVerified);
      } else if (
        import.meta.env.VITE_APP_DEFAULTAUTH === "fake" ||
        import.meta.env.VITE_APP_DEFAULTAUTH === "jwt"
      ) {
        setName(obj.name);
        setemail(obj.email);
        setidx(obj.uid);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    dispatch(getProfile(obj.uid));
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setLastName(currentUser.lastName || "");
      setPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: name || "",
      lastName: lastName || "",
      phone: phone || "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name").max(30),
      lastName: Yup.string().required("Please Enter Your Last Name").max(100),
      phone: Yup.string().required("Please Enter Your Phone"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Skote" breadcrumbItem={props.t("Profile")} />

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div>
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className=" p-2 flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{`${name} ${lastName}`}</h5>
                        <p className="mb-1">{email}</p>
                        {/* <p className="mb-0">Id no: #{idx}</p>  */}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-3">{props.t("Edit Profile")}{""}</h4>

          {!emailVerified ? (
            <Alert color="warning">
              {
                "Check your inbox to confirm your email and unlock all features!"
              }
            </Alert>
          ) : null}

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group mb-3">
                  <Label className="form-label">{props.t("Name")}{""}</Label>
                  <Input
                    name="name"
                    // value={name}
                    className="form-control"
                    placeholder={props.t("Enter your name")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name
                        ? true
                        : false
                    }
                    disabled={!emailVerified}
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mb-3">
                  <Label className="form-label">{props.t("Last name")}{""}</Label>
                  <Input
                    name="lastName"
                    // value={name}
                    className="form-control"
                    placeholder={props.t("Enter your last name")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.lastName || ""}
                    invalid={
                      validation.touched.lastName && validation.errors.lastName
                        ? true
                        : false
                    }
                    disabled={!emailVerified}
                  />
                  {validation.touched.lastName && validation.errors.lastName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.lastName}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mb-3">
                  <Label className="form-label">{props.t("Phone")}{""}</Label>
                  <Input
                    name="phone"
                    // value={name}
                    className="form-control"
                    placeholder={props.t("Enter your phone")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.phone || ""}
                    invalid={
                      validation.touched.phone && validation.errors.phone
                        ? true
                        : false
                    }
                    disabled={!emailVerified}
                  />
                  {validation.touched.phone && validation.errors.phone ? (
                    <FormFeedback type="invalid">
                      {validation.errors.phone}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    color="danger"
                    disabled={!emailVerified}
                  >
                    {props.t("Update Profile")}{""}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(withRouter(UserProfile));
