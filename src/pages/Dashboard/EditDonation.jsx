import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const EditDonation = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axiosSecure.get(`/api/donation-campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.error('Failed to fetch campaign', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id, axiosSecure]);

  const validationSchema = Yup.object().shape({
    petName: Yup.string().required('Pet name is required'),
    maxDonation: Yup.number().required('Max donation is required').min(1),
    shortDesc: Yup.string().required('Short description is required'),
    longDesc: Yup.string().required('Long description is required'),
    lastDate: Yup.date().required('Last date is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let imageUrl = values.image;

      if (values.image && typeof values.image !== 'string') {
        const formData = new FormData();
        formData.append('image', values.image);
        const uploadRes = await fetch(imageHostingUrl, {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.data?.url;
      }

      const updatedData = {
        petName: values.petName,
        maxDonation: parseInt(values.maxDonation),
        shortDesc: values.shortDesc,
        longDesc: values.longDesc,
        lastDate: values.lastDate,
        image: imageUrl,
      };

      const res = await axiosSecure.patch(`/api/donation-campaigns/${id}`, updatedData);

      if (res.data?.modifiedCount > 0) {
        Swal.fire('Success', 'Campaign updated successfully', 'success');
        navigate('/dashboard/my-donation-campaigns');
      } else {
        Swal.fire('Info', 'No changes made', 'info');
      }
    } catch (err) {
      Swal.fire('Error', 'Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !campaign) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-center font-bold text-3xl text-red-600 pb-5">
        Edit Donation Campaign
      </h1>

      <Formik
        initialValues={{
          petName: campaign.petName || '',
          maxDonation: campaign.maxDonation || '',
          shortDesc: campaign.shortDesc || '',
          longDesc: campaign.longDesc || '',
          lastDate: campaign.lastDate?.slice(0, 10) || '',
          image: campaign.image || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">

         
         <div>
              <label className="block mb-1 font-semibold">Pet Image</label>
              {values.image && typeof values.image === 'string' ? (
                <img src={values.image} alt="Preview" className="w-40 h-28 object-cover rounded mb-2 border" />
              ) : values.image && typeof values.image !== 'string' ? (
                <img
                  src={URL.createObjectURL(values.image)}
                  alt="Preview"
                  className="w-40 h-28 object-cover rounded mb-2 border"
                />
              ) : null}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue('image', file);
                }}
                className="file-input file-input-bordered w-full"
              />
            </div>


         

            <div>
              <label className="block mb-1 font-semibold">Pet Name</label>
              <Field name="petName" type="text" className="input input-bordered w-full" />
              {touched.petName && errors.petName && (
                <div className="text-red-500 text-sm">{errors.petName}</div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Last Date</label>
              <Field name="lastDate" type="date" className="input input-bordered w-full" />
              {touched.lastDate && errors.lastDate && (
                <div className="text-red-500 text-sm">{errors.lastDate}</div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Max Donation</label>
              <Field name="maxDonation" type="number" className="input input-bordered w-full" />
              {touched.maxDonation && errors.maxDonation && (
                <div className="text-red-500 text-sm">{errors.maxDonation}</div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Short Description</label>
              <Field as="textarea" name="shortDesc" className="textarea textarea-bordered w-full" />
              {touched.shortDesc && errors.shortDesc && (
                <div className="text-red-500 text-sm">{errors.shortDesc}</div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Long Description</label>
              <Field as="textarea" name="longDesc" className="textarea textarea-bordered w-full" />
              {touched.longDesc && errors.longDesc && (
                <div className="text-red-500 text-sm">{errors.longDesc}</div>
              )}
            </div>

            

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Campaign'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditDonation;
