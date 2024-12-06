import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";


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
import { changePassword, getProfile, resetProfileFlag } from "/src/store/actions";

const ChangePassword = (props) => {
  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
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
    }
  }, [currentUser]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      idx: idx || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .required("Please Enter Your Password")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character",
        ),
      newPassword: Yup.string()
        .required("Please Enter Your New Password")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character",
        )
        .notOneOf(
          [Yup.ref("currentPassword")],
          "New Password must be different from Current Password",
        ),

      // Validação para confirmar nova senha
      confirmNewPassword: Yup.string()
        .required("Please Confirm Your New Password")
        .oneOf(
          [Yup.ref("newPassword")],
          "Confirm Password must match New Password",
        ),
    }),
    onSubmit: (values) => {
      dispatch(changePassword(values));
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

          <h4 className="card-title mb-3">{props.t("Change Password")}{""}</h4>

          {!emailVerified ? (
            <Alert color="warning">
              {
                props.t("Check your inbox to confirm your email and unlock all features!")
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
                  <Label className="form-label">{props.t("Current Password")}{""}</Label>
                  <Input
                    name="currentPassword"
                    // value={name}
                    className="form-control"
                    placeholder={props.t("Enter Current Password")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    // value={validation.values.lastName || ""}
                    invalid={
                      validation.touched.currentPassword &&
                      validation.errors.currentPassword
                        ? true
                        : false
                    }
                    disabled={!emailVerified}
                  />
                  {validation.touched.currentPassword &&
                  validation.errors.currentPassword ? (
                    <FormFeedback type="invalid">
                      {validation.errors.currentPassword}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mb-3">
                  <Label className="form-label">{props.t("New Password")}{""}</Label>
                  <Input
                    name="newPassword"
                    // value={name}
                    className="form-control"
                    placeholder={props.t("Enter New Password")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.newPassword || ""}
                    invalid={
                      validation.touched.newPassword && validation.errors.newPassword
                        ? true
                        : false
                    }
                    disabled={!emailVerified}
                  />
                  {validation.touched.newPassword && validation.errors.newPassword ? (
                    <FormFeedback type="invalid">
                      {validation.errors.newPassword}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mb-3">
                  <Label className="form-label">{props.t("Confirm New Password")}{""}</Label>
                  <Input
                    name="confirmNewPassword"
                    // value={name}
                    className="form-control"
                    placeholder={props.t("Enter Confirm New Password")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.confirmNewPassword || ""}
                    invalid={
                      validation.touched.confirmNewPassword && validation.errors.confirmNewPassword
                        ? true
                        : false
                    }
                    disabled={!emailVerified}
                  />
                  {validation.touched.confirmNewPassword && validation.errors.confirmNewPassword ? (
                    <FormFeedback type="invalid">
                      {validation.errors.confirmNewPassword}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    color="danger"
                    disabled={!emailVerified}
                  >
                    {props.t("Change Password")}{""}
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

export default withTranslation()(withRouter(ChangePassword));
