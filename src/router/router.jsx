import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import CategoryPage from "../pages/Home/CategoryPage";
import PetListing from "../pages/PetListing";
import PetDetails from "../pages/PetDetails/PetDetails";
import DonationCampaigns from "../pages/DonationCampaigns/DonationCampaigns";
import DonationDetails from "../pages/DonationCampaigns/DonationDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "../routes/PrivateRoute";
import AddPet from "../pages/Dashboard/AddPet/AddPet";
import MyAddedPets from "../pages/Dashboard/MyAddedPets/MyAddedPets";
import UpdatePet from "../pages/Dashboard/UpdatePet";
import CreateDonationCampaign from "../pages/Dashboard/CreateDonationCampaign";
import MyDonationCampaigns from "../pages/Dashboard/MyDonationCampaigns";
import EditDonation from "../pages/Dashboard/EditDonation";
import MyDonations from "../pages/Dashboard/MyDonations";
import AdoptionRequest from "../pages/Dashboard/AdoptionRequest";
import AdminUsersPage from "../pages/Dashboard/admin/AdminUsersPage";
import AdminRoute from "../hooks/AdminRoute";
import AdminAllPets from "../pages/Dashboard/admin/AdminAllPets";
import AdminAllDonations from "../pages/Dashboard/admin/AdminAllDonations";
import EditAdminDonation from "../pages/Dashboard/admin/EditAdminDonation";
import ErrorPage from "../pages/ErrorPage";


export const router = createBrowserRouter([
  {
    path: "/",
    Component : RootLayout,
    errorElement: <ErrorPage />,
    children: [
        {
            index: true,
            Component: Home,
        },
        {
        path: "/category/:type", 
        Component: CategoryPage,
      }

    ]
  },

  {
    path: "/pet-listing",
    element: <PetListing></PetListing>
  },

  {
    path: "/pets/:id",
    element: <PetDetails></PetDetails>
  },

  {
     path:"/donation-campaigns",
     element:<DonationCampaigns></DonationCampaigns>
  },

  {
     path:"/donation-campaigns/:id",
     element: <DonationDetails></DonationDetails>
  },

  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    errorElement: <ErrorPage />,
    children : [
      {
        path: "/auth/login",
        element:<Login></Login>
      },
        {
        path: "/auth/register",
        element:<Register></Register>
        }
        
         ]
  },
  {
    path:"/dashboard",
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    errorElement: <ErrorPage />,
    children : [
      {
        path: "/dashboard/add-pet",
        element:<AddPet></AddPet>
      },
        {
        path: "/dashboard/my-added-pets",
        element:<MyAddedPets></MyAddedPets>
        },
        {
      path: "/dashboard/update-pet/:id",
      element: <UpdatePet></UpdatePet>
    },
    {
      path: "/dashboard/createdonationcampaign",
      element: <CreateDonationCampaign></CreateDonationCampaign>
    },
    {
      path: "/dashboard/my-donation-campaigns",
      element: <MyDonationCampaigns></MyDonationCampaigns>
    },
    {
      path: "/dashboard/edit-donation/:id",
      element: <EditDonation></EditDonation>
    },
    
    {
      path: "/dashboard/mydonations",
      element: <MyDonations></MyDonations>
    },

    {
      path: "/dashboard/adoptionrequest",
      element: <AdoptionRequest></AdoptionRequest>
    },

    {
      path: "/dashboard/adminuserspage",
      element: <AdminRoute><AdminUsersPage></AdminUsersPage></AdminRoute>
      
    },

    {
      path: "/dashboard/admin-all-pets",
      element: <AdminRoute> <AdminAllPets></AdminAllPets> </AdminRoute>
      
    },

    {
      path: "/dashboard/admin-all-donations",
      element: <AdminRoute> <AdminAllDonations></AdminAllDonations> </AdminRoute>
      
    },

    {
      path: "/dashboard/admin-edit-donation/:id",
      element: <AdminRoute> <EditAdminDonation></EditAdminDonation> </AdminRoute> 
    }

    
         ]
      
  }

]);