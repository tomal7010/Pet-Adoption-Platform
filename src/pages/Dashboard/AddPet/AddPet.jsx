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
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    description: "",
    longDescription: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Pet name is required"),
    type: Yup.string().required("Pet category is required"),
    age: Yup.number().required("Age is required"),
    location: Yup.string().required("Location is required"),
    description: Yup.string().required("Short description is required"),
    longDescription: Yup.string().required("Long description is required"),
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
      image: imageUrl,
      status: "Available",
      adopted: false,
      created_at: new Date(),
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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add a Pet</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label>Pet Image:</label>
              <input type="file" onChange={handleImageUpload} className="input" />
              {uploading && <p>Uploading image...</p>}
              {imageUrl && <img src={imageUrl} alt="Uploaded" className="h-24 mt-2" />}
            </div>
            <div>
              <label>Pet Name:</label>
              <Field name="name" className="input" />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Pet Category:</label>
              <Select
                options={petCategories}
                onChange={(option) => setFieldValue("type", option.value)}
              />
              <ErrorMessage name="type" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Breed:</label>
              <Field name="breed" className="input" />
            </div>
            <div>
              <label>Age:</label>
              <Field name="age" type="number" className="input" />
              <ErrorMessage name="age" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Gender:</label>
              <Field as="select" name="gender" className="input">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
            </div>
            <div>
              <label>Location:</label>
              <Field name="location" className="input" />
              <ErrorMessage name="location" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Short Description:</label>
              <Field name="description" className="input" />
              <ErrorMessage name="description" component="div" className="text-red-500" />
            </div>
            <div>
              <label>Long Description:</label>
              <Field name="longDescription" as="textarea" className="textarea" />
              <ErrorMessage name="longDescription" component="div" className="text-red-500" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Pet"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPet;
