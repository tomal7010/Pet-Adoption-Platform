import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../contexts/AuthProvider";

const petCategories = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Fish", label: "Fish" },
  { value: "Rabbit", label: "Rabbit" },
];

const validationSchema = Yup.object({
  petName: Yup.string().required("Pet name is required"),
  type: Yup.string().required("Pet category is required"),
  age: Yup.number().required("Age is required"),
  location: Yup.string().required("Location is required"),
  shortDesc: Yup.string().required("Short description is required"),
  longDesc: Yup.string().required("Long description is required"),
  petImage: Yup.string().required("Image is required"),
});

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

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
      setFieldValue("petImage", uploadedUrl);
    } catch (error) {
      Swal.fire("Error", "Image upload failed!", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const updatedPet = {
      ...values,
      updated_at: new Date(),
      userPostName: user?.displayName || "Anonymous",
      userPostEmail: user?.email || "unknown@example.com",
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
    return <div className="text-center py-10">


      <span className="loading loading-bars loading-xs"></span>
      <span className="loading loading-bars loading-sm"></span>
      <span className="loading loading-bars loading-md"></span>
      <span className="loading loading-bars loading-lg"></span>
      <span className="loading loading-bars loading-xl"></span>



    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
          Update Pet
        </h2>

        <Formik
          initialValues={{
            petName: petData.petName || "",
            type: petData.type || "",
            breed: petData.breed || "",
            age: petData.age || "",
            gender: petData.gender || "",
            location: petData.location || "",
            shortDesc: petData.shortDesc || "",
            longDesc: petData.longDesc || "",
            petImage: petData.petImage || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block font-medium mb-1">Pet Image</label>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                  className="block w-full text-sm text-gray-600 
                    file:mr-3 file:py-2 file:px-4 
                    file:rounded-full file:border-0 
                    file:bg-blue-100 file:text-blue-700 
                    hover:file:bg-blue-200 cursor-pointer"
                />
                {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                {values.petImage && (
                  <img
                    src={values.petImage}
                    alt="Uploaded"
                    className="h-28 w-28 mt-3 rounded-lg border shadow-md object-cover"
                  />
                )}
                <ErrorMessage name="petImage" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Pet Name */}
              <div>
                <label className="block font-medium mb-1">Pet Name</label>
                <Field
                  name="petName"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <ErrorMessage name="petName" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Pet Category */}
              <div>
                <label className="block font-medium mb-1">Pet Category</label>
                <Select
                  options={petCategories}
                  value={petCategories.find((opt) => opt.value === values.type)}
                  onChange={(option) => setFieldValue("type", option.value)}
                />
                <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Breed */}
              <div>
                <label className="block font-medium mb-1">Breed</label>
                <Field
                  name="breed"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block font-medium mb-1">Age</label>
                <Field
                  name="age"
                  type="number"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <Field
                  as="select"
                  name="gender"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Field>
              </div>

              {/* Location */}
              <div>
                <label className="block font-medium mb-1">Location</label>
                <Field
                  name="location"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-medium mb-1">Short Description</label>
                <Field
                  name="shortDesc"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <ErrorMessage name="shortDesc" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Long Description */}
              <div>
                <label className="block font-medium mb-1">Long Description</label>
                <Field
                  name="longDesc"
                  as="textarea"
                  rows="4"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <ErrorMessage name="longDesc" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition disabled:opacity-60"
              >
                {isSubmitting ? "Updating..." : "Update Pet"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdatePet;
