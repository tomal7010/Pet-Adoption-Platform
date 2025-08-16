import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const petCategories = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Fish", label: "Fish" },
  { value: "Rabbit", label: "Rabbit" },
];

const AddPet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const initialValues = {
    petName: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    shortDesc: "",
    longDesc: "",
  };

  const validationSchema = Yup.object({
    petName: Yup.string().required("Pet name is required"),
    type: Yup.string().required("Pet category is required"),
    age: Yup.number().required("Age is required"),
    location: Yup.string().required("Location is required"),
    shortDesc: Yup.string().required("Short description is required"),
    longDesc: Yup.string().required("Long description is required"),
  });

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
    } catch (error) {
      console.error("Image upload failed", error);
      Swal.fire("Error", "Image upload failed!", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!imageUrl) {
      Swal.fire("Image Required", "Please upload an image!", "warning");
      setSubmitting(false);
      return;
    }

    const petData = {
      ...values,
      petImage: imageUrl,
      status: "Available",
      adopted: false,
      created_at: new Date(),
      userPostEmail: user?.email,
      userPostName: user?.displayName,
      userEmail: user?.email,
    };

    try {
      const res = await axiosSecure.post("/api/pets", petData);
      if (res.data.insertedId || res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Pet added successfully!",
          timer: 1800,
          showConfirmButton: false,
        });
        resetForm();
        setImageUrl("");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error adding pet", error);
      Swal.fire("Error", error.message || "Failed to add pet", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-center font-bold text-3xl text-red-600 pb-6">Add a Pet</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-5">
            {/* Image Upload */}
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

            {/* Pet Category */}
            <div>
              <label className="font-medium">Pet Category:</label>
              <Select
                options={petCategories}
                className="mt-1"
                onChange={(option) => setFieldValue("type", option.value)}
              />
              <ErrorMessage name="type" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Breed */}
            <div>
              <label className="font-medium">Breed:</label>
              <Field name="breed" className="input input-bordered w-full mt-1" />
            </div>

            {/* Age */}
            <div>
              <label className="font-medium">Age:</label>
              <Field
                name="age"
                type="number"
                className="input input-bordered w-full mt-1"
              />
              <ErrorMessage name="age" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Gender */}
            <div>
              <label className="font-medium">Gender:</label>
              <Field as="select" name="gender" className="select select-bordered w-full mt-1">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
            </div>

            {/* Location */}
            <div>
              <label className="font-medium">Location:</label>
              <Field name="location" className="input input-bordered w-full mt-1" />
              <ErrorMessage name="location" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Short Description */}
            <div>
              <label className="font-medium">Short Description:</label>
              <Field
                name="shortDesc"
                className="input input-bordered w-full mt-1"
              />
              <ErrorMessage name="shortDesc" component="div" className="text-red-500 mt-1" />
            </div>

            {/* Long Description */}
            <div>
              <label className="font-medium">Long Description:</label>
              <Field
                name="longDesc"
                as="textarea"
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
              {isSubmitting ? "Submitting..." : "Add Pet"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPet;
