import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import PhishingAlert from "../../Components/Shared/PhishingAlert";
import useCampaigns from "../../hooks/useCampaigns";
import useTemplates from "../../hooks/useTemplates";
import useLandingPages from "../../hooks/useLandingPages";
import useRecipients from "../../hooks/useRecipients";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageCampaigns } from "../../utils/roles";

import "../../Components/Shared/PhishingShared.css";
import { useFormik } from "formik";

const STEPS = ["Create", "Recipients", "Review"];

export default function CampaignCreate() {

  const navigate = useNavigate();

  const {
    createCampaign,
    attachCampaignRecipients
  } = useCampaigns();

  const { templates } = useTemplates();

  const { pages } = useLandingPages();

  const { allRecipients } = useRecipients();

  const [step, setStep] = useState(0);

  const [error, setError] = useState(null);

  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const toggleRecipient = (id) => {

    setSelectedRecipients((prev) =>

      prev.includes(id)

        ? prev.filter((x) => x !== id)

        : [...prev, id]

    );

  };



  const createCampaignFormik = useFormik({

    initialValues: {

      name: "",

      templateId: "",

      landingPageId: "",

      recipients: []

    },



    validate: (values) => {

      const errors = {};



      if (!values.name.trim()) {

        errors.name = "Campaign name is required";

      }



      if (!values.templateId) {

        errors.templateId = "Please select a template";

      }



      if (!values.landingPageId) {

        errors.landingPageId = "Please select a landing page";

      }



      return errors;

    },



    onSubmit: async (values) => {

      setError(null);



      try {

        const res = await createCampaign(values);



        const id =

          res.data?.id ??

          res.data?.campaign?.id;



        if (selectedRecipients.length) {

          await attachCampaignRecipients(

            id,

            selectedRecipients

          );

        }



        navigate(

          `/Phishing/Campaigns/${id}/launch`

        );

      }

      catch (err) {

        setError(err.message);

      }

    }

  });



  const goToRecipients = async () => {

    const errors =

      await createCampaignFormik.validateForm();



    createCampaignFormik.setTouched({

      name: true,

      templateId: true,

      landingPageId: true

    });



    if (Object.keys(errors).length === 0) {

      setStep(1);

    }

  };



  return (

    <RoleGate

      allow={canManageCampaigns}

      fallback={

        <p className="text-danger p-3">

          Access denied.

        </p>

      }

    >

      <div className="phishing-soc-page">

        <h5 className="text-white">

          Create Campaign

        </h5>



        <PhishingAlert

          type="danger"

          message={error}

        />



        <div className="wizard-steps">

          {

            STEPS.map((s, i) => (

              <div

                key={s}

                className={`wizard-step

                  ${

                    i === step

                    ? "active"

                    : i < step

                    ? "done"

                    : ""

                  }

                `}

              >

                {i + 1}. {s}

              </div>

            ))

          }

        </div>



        {

          step === 0 &&

          (

            <div className="dashboard-card p-3">

              {/* Campaign Name */}

              <div className="mb-3">


              {

                createCampaignFormik.touched.name &&

                createCampaignFormik.errors.name &&

                (

                  <div className="text-danger mt-1">

                    {

                      createCampaignFormik.errors.name

                    }

                  </div>

                )

              }

                <label className="text-secondary mb-2" htmlFor="name">

                  Campaign Name

                </label>



                <input

                  className="form-control header-search-input ps-2"

                  name="name"
                  id="name"

                  placeholder="Campaign Name..."

                  value={createCampaignFormik.values.name}

                  onChange={createCampaignFormik.handleChange}

                  onBlur={createCampaignFormik.handleBlur}

                />



              

              </div>



              {/* Template */}

              <div className="mb-3">




              {

                createCampaignFormik.touched.templateId &&

                createCampaignFormik.errors.templateId &&

                (

                  <div className="text-danger mt-1">

                    {

                      createCampaignFormik.errors.templateId

                    }

                  </div>

                )

              }


                <label className="text-secondary mb-2" htmlFor="templete">

                  Email Template

                </label>



                <select

                  className="form-select scanType-select border-0 ps-2"

                  name="templateId"

                  id="templete"

                  value={

                    createCampaignFormik.values.templateId

                  }

                  onChange={

                    createCampaignFormik.handleChange

                  }

                  onBlur={

                    createCampaignFormik.handleBlur

                  }

                >

                  <option value="">

                    Select template

                  </option>



                  {

                    templates.map((t) => (

                      <option

                        key={t.id}

                        value={t.id}

                      >

                        {t.name}

                      </option>

                    ))

                  }

                </select>



                
              </div>



              {/* Landing Page */}

              <div className="mb-3">




            {

              createCampaignFormik.touched.landingPageId &&

              createCampaignFormik.errors.landingPageId &&

              (

                <div className="text-danger mt-1">

                  {

                    createCampaignFormik.errors.landingPageId

                  }

                </div>

              )

              }

                <label className="text-secondary mb-2" htmlFor="landingPage">

                  Landing Page

                </label>



                <select

                  className="form-select scanType-select border-0 ps-2"

                  name="landingPageId"

                  id="landingPage"

                  value={

                    createCampaignFormik.values.landingPageId

                  }

                  onChange={

                    createCampaignFormik.handleChange

                  }

                  onBlur={

                    createCampaignFormik.handleBlur

                  }

                >

                  <option value="">

                    Select landing page

                  </option>



                  {

                    pages.map((p) => (

                      <option

                        key={p.id}

                        value={p.id}

                      >

                        {p.name}

                      </option>

                    ))

                  }

                </select>


              </div>



              <button

                type="button"

                className="btn add-btn text-white border-0"

                onClick={goToRecipients}

              >

                Next

              </button>

            </div>

          )

        }



        {

          step === 1 &&

          (

            <div className="dashboard-card p-3">

              <h6 className="text-white mb-3">

                Attach Recipients

              </h6>



              <div

                style={{

                  maxHeight: 300,

                  overflowY: "auto"

                }}

              >

                {

                  allRecipients.map((r) => (

                    <label

                      key={r.id}

                      className="d-flex align-items-center gap-2 mb-2 text-white"

                    >

                      <input

                        type="checkbox"

                        checked={

                          selectedRecipients.includes(r.id)

                        }

                        onChange={() =>

                          toggleRecipient(r.id)

                        }

                      />



                      {

                        r.name

                      }

                      {" — "}

                      {

                        r.email

                      }

                      {" ("}

                      {

                        r.department

                      }

                      {")"}

                    </label>

                  ))

                }

              </div>



              <div className="mt-3 d-flex justify-content-between gap-2">

                <button

                  type="button"

                  className="btn add-btn text-white border-0"

                  onClick={() => setStep(0)}

                >

                  Back

                </button>



                <button

                  type="button"

                  className="btn add-btn text-white border-0"

                  onClick={() => setStep(2)}

                >

                  Next

                </button>

              </div>

            </div>

          )

        }



        {

          step === 2 &&

          (

            <div className="dashboard-card p-3">

              <h6 className="text-white">

                Review & Create

              </h6>



              <p className="text-secondary">

                Name:

                {" "}

                {

                  createCampaignFormik.values.name

                }

              </p>



              <p className="text-secondary">

                Recipients:

                {" "}

                {

                  selectedRecipients.length

                }

              </p>



              <div className="d-flex justify-content-between gap-2">

                <button

                  type="button"

                  className="btn add-btn text-white border-0"

                  onClick={() => setStep(1)}

                >

                  Back

                </button>



                <button

                  type="button"

                  className="btn add-btn text-white border-0"

                  onClick={

                    createCampaignFormik.handleSubmit

                  }

                >

                  Create & Go to Launch

                </button>

              </div>

            </div>

          )

        }

      </div>

    </RoleGate>

  );

}