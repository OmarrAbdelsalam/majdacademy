"use client";
import React, { useState, useEffect } from "react";
import BookingModal from "./BookingModal";

export default function CurriculumAutoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open the popup after a brief delay so it feels natural
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} variant="default" />;
}
