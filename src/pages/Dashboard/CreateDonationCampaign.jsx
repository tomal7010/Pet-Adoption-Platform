import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthProvider";

const validationSchema = Yup.object({
  petName: Yup.string().required("Pet name is required"),
  maxAmount: Yup.number().required("Maximum donation amount is required"),
  lastDate: Yup.date().required("Last date is required"),
  shortDesc: Yup.string().required("Short description is required"),
  longDesc: Yup.string().required("Long description is required"),
});

const CreateDonationCampaign = () => {
  const axiosSecure = useAxiosSecure();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
        formData
      );
      setImageUrl(res.data.data.url);
    } catch {
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!imageUrl) {
      Swal.fire("Image Required", "Please upload a pet image", "warning");
      setSubmitting(false);
      return;
    }

    const donationData = {
      ...values,
      image: imageUrl,
      userDonationPostEmail: user?.email || "unknown@example.com",
      userDonationPostName: user?.displayName || "Anonymous",
      userEmail: user?.email || "unknown@example.com",
      donate: false,
    };

    try {
      const res = await axiosSecure.post("/api/donation-campaigns", donationData);
      if (res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Donation Campaign Created!",
          showConfirmButton: false,
          timer: 1500,
        });
        resetForm();
        setImageUrl("");
      }
    } catch {
      Swal.fire("Error", "Failed to create campaign", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-center font-bold text-3xl text-red-600 pb-5">
        Create Donation Campaign
      </h1>

      <Formik
        initialValues={{
          petName: "",
          maxAmount: "",
          lastDate: "",
          shortDesc: "",
          longDesc: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            {/* Pet Image */}
            <div className="flex flex-col items-center">
              <label className="font-medium mb-2">Pet Image:</label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full max-w-xs"
              />
              {uploading && <p className="text-gray-500 mt-2">Uploading image...</p>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="h-32 w-32 object-cover rounded-lg mt-3 shadow-md"
                />
              )}
            </div>

            {/* Pet Name */}
            <div>
              <label className="font-medium">Pet Name:</label>
              <Field name="petName" className="input input-bordered w-full mt-1" />
              <ErrorMessage name="petName" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Maximum Donation Amount */}
            <div>
              <label className="font-medium">Maximum Donation Amount:</label>
              <Field
                name="maxAmount"
                type="number"
                className="input input-bordered w-full mt-1"
              />
              <ErrorMessage name="maxAmount" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Last Date */}
            <div>
              <label className="font-medium">Last Date of Donation:</label>
              <Field
                name="lastDate"
                type="date"
                className="input input-bordered w-full mt-1"
              />
              <ErrorMessage name="lastDate" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Short Description */}
            <div>
              <label className="font-medium">Short Description:</label>
              <Field name="shortDesc" className="input input-bordered w-full mt-1" />
              <ErrorMessage name="shortDesc" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Long Description */}
            <div>
              <label className="font-medium">Long Description:</label>
              <Field
                as="textarea"
                name="longDesc"
                className="textarea textarea-bordered w-full mt-1"
              />
              <ErrorMessage name="longDesc" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </button>

            {/* Created By */}
            {user?.displayName && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Created By: {user.displayName}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateDonationCampaign;
