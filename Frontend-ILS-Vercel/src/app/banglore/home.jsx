"use client";

import React from "react";
import DemoClasses from "./sharedComponents/DemoClasses";
import PopularCourses from "./sharedComponents/Popular";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllCourses } from "@/redux/features/courseSlice";
import Blog from "./sharedComponents/Blogs";
import CompanySlider from "./sharedComponents/CompanySlider";
import UserReviews from "./sharedComponents/UserReviews";
import WhatsAppChat from "./sharedComponents/WhatsAppChat";
import HeroSlider from "./sharedComponents/Hero";

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  return (
    <div className="main">
      <HeroSlider/>
      <DemoClasses />
      <CompanySlider />
      <PopularCourses />
      <UserReviews />
      <Blog />
      <WhatsAppChat />
    </div>
  );
}
