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

export const router = createBrowserRouter([
  {
    path: "/",
    Component : RootLayout,
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
    }
        
         ]
      
  }

]);