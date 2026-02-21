"use client";

import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.ContactFormSponsorSlice} ContactFormSponsorSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ContactFormSponsorSlice>} ContactFormSponsorProps
 * @param {ContactFormSponsorProps}
 */
const ContactFormSponsor = ({ slice }) => {
  const [state, handleSubmit] = useForm("mbllqjqb");
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoonnummer: '',
    bedrijfsnaam: '',
    message: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear error when user starts typing again
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { voornaam, email, woonplaats } = formData;

    // Check required fields
    if (!voornaam || !email || !woonplaats) {
      setErrorMessage('Vul alle verplichte velden in.');
      return;
    }

    setErrorMessage('');
    handleSubmit(event);
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="
        flex w-full h-full p-2 lg:p-8 gap-6
        flex-col
      "
    >
      <div className={`
        text-justify
        ${slice.variation === "sponsorformulier" ? "hidden" : ""}
      `}>
        <h1 className="px-4 py-4">Contact</h1>
        <div className="p-4">
          <PrismicRichText
            components={{
              paragraph: ({ children }) => <p className="pb-2">{children}</p>,
            }}
            field={slice.primary.body}
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <form
          className="
            flex flex-col gap-2 
            bg-secondary rounded-lg p-4 
            w-full
          "
          onSubmit={handleFormSubmit}
        >
          <div className="lg:flex lg:gap-2">
            <label className="lg:w-1/2">
              Voornaam: <span className="text-red-500">*</span>
              <input
                type="text"
                name="voornaam"
                className="
                  text-black text-xs 
                  w-full p-2 
                  bg-white rounded
                "
                value={formData.voornaam}
                onChange={handleInputChange}
              />
            </label>
            <label className="lg:w-1/2">
              Achternaam:
              <input
                type="text"
                name="achternaam"
                className="
                  text-black text-xs 
                  w-full p-2 
                  bg-white rounded
                "
                value={formData.achternaam}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="lg:flex lg:gap-2">
            <label className="lg:w-1/2">
              Email: <span className="text-red-500">*</span>
              <input
                type="email"
                name="email"
                className="
                  text-black text-xs 
                  w-full p-2 
                  bg-white rounded
                "
                value={formData.email}
                onChange={handleInputChange}
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </label>
            <label className="lg:w-1/2">
              Telefoonnummer:
              <input
                type="tel"
                name="telefoonnummer"
                className="
                  text-black text-xs 
                  w-full p-2 
                  bg-white rounded
                "
                value={formData.telefoonnummer}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <label>
            Bedrijfsnaam: <span className="text-red-500">*</span>
            <input
              name="bedrijfsnaam"
              className="
                text-black text-xs 
                w-full p-2 mb-4 
                bg-white rounded
              "
              value={formData.bedrijfsnaam}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <textarea
              name="message"
              rows="15"
              className="
                text-black text-xs 
                w-full p-2 
                bg-white rounded
              "
              placeholder="Schrijf hier uw bericht..."
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
            <ValidationError prefix="Message" field="message" errors={state.errors} />
          </label>
          <button
            type="submit"
            className="
              p-2 
              bg-primary text-white 
              rounded
            "
            disabled={state.submitting}
          >
            Verzenden
          </button>
          {state.succeeded && <p className="bg-green-500 mt-2 text-white rounded-lg p-2 font-bold">Formulier succesvol verzonden!</p>}
          {errorMessage && <p className="bg-red-500 mt-2 text-white rounded-lg p-2 font-bold">{errorMessage}</p>}
          {state.errors && <p className="bg-red-500 mt-2 text-white rounded-lg p-2 font-bold">Er is een fout opgetreden bij het verzenden van het formulier.</p>}
        </form>
      </div>
    </section>
  );
};

export default ContactFormSponsor;
