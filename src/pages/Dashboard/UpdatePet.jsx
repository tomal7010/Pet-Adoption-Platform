import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const petCategories = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Fish", label: "Fish" },
  { value: "Rabbit", label: "Rabbit" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Pet name is required"),
  type: Yup.string().required("Pet category is required"),
  age: Yup.number().required("Age is required"),
  location: Yup.string().required("Location is required"),
  description: Yup.string().required("Short description is required"),
  longDescription: Yup.string().required("Long description is required"),
  image: Yup.string().required("Image is required"),
});

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [petData, setPetData] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axiosSecure.get(`/api/pets/${id}`);
        setPetData(res.data);
      } catch (error) {
        Swal.fire("Error", "Failed to load pet data", "error");
      }
    };
    fetchPet();
  }, [id, axiosSecure]);

  const handleImageUpload = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
        formData
      );
      const uploadedUrl = res.data?.data?.url;
      setFieldValue("image", uploadedUrl);
    } catch (error) {
      console.error("Image upload failed", error);
      Swal.fire("Error", "Image upload failed!", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const updatedPet = {
      ...values,
      updated_at: new Date(),
    };

    try {
      const res = await axiosSecure.put(`/api/pets/${id}`, updatedPet);
      if (res.data?.modifiedCount > 0 || res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Pet Updated!",
          timer: 1800,
          showConfirmButton: false,
        });
        navigate("/dashboard/my-added-pets");
      } else {
        Swal.fire("Info", "No changes were made.", "info");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!petData) {
    return <div className="text-center py-10">Loading pet data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Pet</h2>
      <Formik
        initialValues={{
          name: petData.name || "",
          type: petData.type || "",
          breed: petData.breed || "",
          age: petData.age || "",
          gender: petData.gender || "",
          location: petData.location || "",
          description: petData.description || "",
          longDescription: petData.longDescription || "",
          image: petData.image || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form className="space-y-4">

            {/* Image Upload */}
            <div>
              <label>Pet Image:</label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, setFieldValue)}
                className="input"
              />
              {uploading && <p>Uploading image...</p>}
              {values.image && (
                <img src={values.image} alt="Uploaded" className="h-24 mt-2" />
              )}
              <ErrorMessage name="image" component="div" className="text-red-500" />
            </div>

            {/* Name */}
            <div>
              <label>Pet Name:</label>
              <Field name="name" className="input input-bordered w-full" />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>

            {/* Type */}
            <div>
              <label>Pet Category:</label>
              <Select
                options={petCategories}
                value={petCategories.find((opt) => opt.value === values.type)}
                onChange={(option) => setFieldValue("type", option.value)}
              />
              <ErrorMessage name="type" component="div" className="text-red-500" />
            </div>

            {/* Breed */}
            <div>
              <label>Breed:</label>
              <Field name="breed" className="input input-bordered w-full" />
            </div>

            {/* Age */}
            <div>
              <label>Age:</label>
              <Field name="age" type="number" className="input input-bordered w-full" />
              <ErrorMessage name="age" component="div" className="text-red-500" />
            </div>

            {/* Gender */}
            <div>
              <label>Gender:</label>
              <Field as="select" name="gender" className="input input-bordered w-full">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
            </div>

            {/* Location */}
            <div>
              <label>Location:</label>
              <Field name="location" className="input input-bordered w-full" />
              <ErrorMessage name="location" component="div" className="text-red-500" />
            </div>

            {/* Description */}
            <div>
              <label>Short Description:</label>
              <Field name="description" className="input input-bordered w-full" />
              <ErrorMessage name="description" component="div" className="text-red-500" />
            </div>

            {/* Long Description */}
            <div>
              <label>Long Description:</label>
              <Field
                name="longDescription"
                as="textarea"
                className="textarea textarea-bordered w-full"
              />
              <ErrorMessage name="longDescription" component="div" className="text-red-500" />
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Pet"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdatePet;
