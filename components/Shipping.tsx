"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { submitShippingDetails } from "@/lib/actions/shipping";
import { COUNTRIES } from "@/lib/constants";
import {
  validateName,
  validateEmail,
  validatePhone,
  sanitizeString,
  sanitizeEmail,
  validatePostalCode,
  validateStreet,
  validateCity,
} from "@/lib/validation";

const Shipping = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{
    firstname?: string;
    lastname?: string;
    email?: string;
    country?: string;
    city?: string;
    street?: string;
    postalCode?: string;
    phone?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;

    const rawFirstname = form.firstname.value.trim();
    const rawLastname = form.lastname.value.trim();
    // Only read email field if user is a guest
    const rawEmail = !userId ? form.email?.value.trim() ?? "" : "";
    const rawCountry = form.country.value.trim();
    const rawCity = form.city.value.trim();
    const rawStreet = form.street.value.trim();
    const rawPostalCode = form.postalCode.value.trim();
    const rawPhone = form.phone.value.trim();

    if (!rawFirstname) {
      setErrors(prev => ({ ...prev, firstname: "First name is required" }));
      return;
    }
    const firstname = sanitizeString(rawFirstname);
    if (!validateName(firstname)) {
      setErrors(prev => ({ ...prev, firstname: "Please enter a valid first name (2-50 characters, letters only)" }));
      return;
    }

    if (!rawLastname) {
      setErrors(prev => ({ ...prev, lastname: "Last name is required" }));
      return;
    }
    const lastname = sanitizeString(rawLastname);
    if (!validateName(lastname)) {
      setErrors(prev => ({ ...prev, lastname: "Please enter a valid last name (2-50 characters, letters only)" }));
      return;
    }

    let email = "";
    if (!userId) {
      if (!rawEmail) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
        return;
      }
      email = sanitizeEmail(rawEmail);
      if (!validateEmail(email)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
        return;
      }
    }

    if (!rawCountry) {
      setErrors(prev => ({ ...prev, country: "Please select a country" }));
      return;
    }
    const country = sanitizeString(rawCountry);
    if (!COUNTRIES.includes(country)) {
      setErrors(prev => ({ ...prev, country: "Please select a valid country" }));
      return;
    }

    if (!rawCity) {
      setErrors(prev => ({ ...prev, city: "City is required" }));
      return;
    }
    const city = sanitizeString(rawCity);
    if (!validateCity(city)) {
      setErrors(prev => ({ ...prev, city: "Please enter a valid city name (2-50 characters)" }));
      return;
    }

    if (!rawStreet) {
      setErrors(prev => ({ ...prev, street: "Street address is required" }));
      return;
    }
    const street = sanitizeString(rawStreet);
    if (!validateStreet(street)) {
      setErrors(prev => ({ ...prev, street: "Please enter a valid street address (3-100 characters)" }));
      return;
    }

    if (!rawPostalCode) {
      setErrors(prev => ({ ...prev, postalCode: "Postal code is required" }));
      return;
    }
    const postalCode = sanitizeString(rawPostalCode);
    if (!validatePostalCode(postalCode)) {
      setErrors(prev => ({ ...prev, postalCode: "Please enter a valid postal code (3-10 characters)" }));
      return;
    }

    if (!rawPhone) {
      setErrors(prev => ({ ...prev, phone: "Phone number is required" }));
      return;
    }
    const phone = rawPhone.trim();
    if (!validatePhone(phone)) {
      setErrors(prev => ({ ...prev, phone: "Please enter a valid phone number (7-15 digits)" }));
      return;
    }

    setIsPending(true);

    const result = await submitShippingDetails({
      ...(userId ? { userId } : {}),
      firstname,
      lastname,
      ...(email ? { email } : {}),
      country,
      city,
      street,
      postalCode,
      phone,
    });

    if (result.success) {
      router.push("/payment");
    } else {
      const sanitizedError = sanitizeString(String(result.error));
      setErrors(prev => ({ ...prev, firstname: sanitizedError }));
    }

    setIsPending(false);
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-heading-3">Shipping Address</h1>
      <div className="grid grid-cols-2 gap-4 bg-light-light rounded-lg shadow-shadow-s p-8">

        <div className="col-span-1">
          <input
            name="firstname"
            placeholder="First Name"
            className={`w-full p-3 border rounded-lg ${errors.firstname ? 'border-red-500 ring-2 ring-red-500' : ''}`}
            onChange={() => clearError('firstname')}
            maxLength={50}
            required
          />
          {errors.firstname && (
            <p className="text-sm text-red-500 mt-1">{errors.firstname}</p>
          )}
        </div>

        <div className="col-span-1">
          <input
            name="lastname"
            placeholder="Last Name"
            className={`w-full p-3 border rounded-lg ${errors.lastname ? 'border-red-500 ring-2 ring-red-500' : ''}`}
            onChange={() => clearError('lastname')}
            maxLength={50}
            required
          />
          {errors.lastname && (
            <p className="text-sm text-red-500 mt-1">{errors.lastname}</p>
          )}
        </div>

        {/* Email only shown to guests */}
        {!userId && (
          <div className="col-span-2">
            <input
              name="email"
              placeholder="Email"
              type="email"
              className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500 ring-2 ring-red-500' : ''}`}
              onChange={() => clearError('email')}
              maxLength={254}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        )}

        <div className="col-span-2">
          <select
            name="country"
            className={`w-full p-3 border rounded-lg ${errors.country ? 'border-red-500 ring-2 ring-red-500' : ''}`}
            onChange={() => clearError('country')}
            required
          >
            <option value="">Select Country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">{errors.country}</p>
          )}
        </div>

        <div className="col-span-2">
          <input
            name="city"
            placeholder="City"
            className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500 ring-2 ring-red-500' : ''}`}
            onChange={() => clearError('city')}
            maxLength={50}
            required
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city}</p>
          )}
        </div>

        <div className="col-span-1">
          <input
            name="street"
            placeholder="Street Address"
            className={`w-full p-3 border rounded-lg ${errors.street ? 'border-red-500 ring-2 ring-red-500' : ''}`}
            onChange={() => clearError('street')}
            maxLength={100}
            required
          />
          {errors.street && (
            <p className="text-sm text-red-500 mt-1">{errors.street}</p>
          )}
        </div>

        <div className="col-span-1">
          <input
            name="postalCode"
            placeholder="Postal Code"
            className={`w-full p-3 border rounded-lg ${errors.postalCode ? 'border-red-500 ring-2 ring-red-500' : ''}`}
            onChange={() => clearError('postalCode')}
            maxLength={10}
            required
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
          )}
        </div>

        <div className="col-span-2">
          <input
            name="phone"
            placeholder="Phone Number"
            type="tel"
            className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500 ring-2 ring-red-500' : ''}`}
            onChange={() => clearError('phone')}
            maxLength={20}
            required
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-full bg-[#E61A4D] px-6 py-4 text-body-medium text-text-light transition hover:opacity-90 hover:cursor-pointer disabled:opacity-50 mt-10 col-span-2"
        >
          {isPending ? "Saving..." : "Continue to Checkout"}
        </button>
      </div>
    </form>
  );
};

export default Shipping;