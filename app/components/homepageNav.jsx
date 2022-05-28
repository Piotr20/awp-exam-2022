import { useState, useEffect } from "react";
import { Form } from "@remix-run/react";

const HomepageNav = ({ role, profileTypeProp, user }) => {
  const [profileType, setProfileType] = useState();
  useEffect(() => {
    if (user?.userData?.role === "student") {
      setProfileType("company");
    } else if (user?.userData?.role === "company") {
      setProfileType("student");
    }
  }, []);
  switch (role) {
    case "student":
      return (
        <div className="flex w-full justify-between ">
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="company" />
            <button
              className={`w-full text-center py-4 pb-2 ${
                profileType === "company" ? "border-b-2 border-custom-salmon font-bold" : ""
              }`}
              type="submit"
              onClick={() => {
                setProfileType("company");
              }}
            >
              Internship Posts
            </button>
          </Form>
        </div>
      );
      break;
    case "company":
      return (
        <div className="flex w-full justify-between ">
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="student" />
            <button
              className={`w-full text-center py-4 pb-2 ${
                profileType === "student" ? "border-b-2 border-custom-salmon font-bold" : ""
              }`}
              type="submit"
              onClick={() => {
                setProfileType("student");
              }}
            >
              Student Profiles
            </button>
          </Form>
        </div>
      );
      break;

    default:
      return (
        <div className="flex w-full justify-between ">
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="student" />
            <button
              className={`w-full text-center py-4 pb-2 ${
                profileType === "student" ? "border-b-2 border-custom-salmon font-bold" : ""
              }`}
              type="submit"
              onClick={() => {
                setProfileType("student");
              }}
            >
              Student Profiles
            </button>
          </Form>
          <Form className="w-full" method="post">
            <input type="hidden" name="type" defaultValue="company" />
            <button
              className={`w-full text-center py-4 pb-2 ${
                profileType === "company" ? "border-b-2 border-custom-salmon font-bold" : ""
              }`}
              type="submit"
              onClick={() => {
                setProfileType("company");
              }}
            >
              Internship Posts
            </button>
          </Form>
        </div>
      );
      break;
  }
};
export default HomepageNav;
