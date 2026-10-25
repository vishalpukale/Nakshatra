import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchCities,
  fetchEvents,
  fetchForm,
  fetchStates,
  submitRegistration,
} from "../../services/registrationApi";

const buttonClass =
  "rounded-md bg-[linear-gradient(90deg,#3E35A5_0%,#5B1D4D_75%,#94117F_100%)] px-4 py-2 text-white disabled:opacity-50";

const FIELD_RANK = {
  full_name: 1,
  date_of_birth: 2,
  age: 3,
  gender: 4,
  state_id: 5,
  city_id: 6,
  hometown: 7,
  mobile: 8,
  email: 9,
  instagram_link: 10,
  main_category: 11,
  other_category: 12,
  sub_category: 13,
  performer_category: 14,
  performing_arts_specify: 15,
  audition_video: 16,
  accepted_terms: 99,
};

function isVisible(field, values) {
  const dependency = field.options?.dependsOn;
  if (!dependency) return true;
  const current = values[dependency.field];
  if (dependency.value != null) return String(current) === String(dependency.value);
  if (Array.isArray(dependency.values)) {
    return dependency.values.map(String).includes(String(current));
  }
  return true;
}

function RegistrationForm({ eventSlug = "", tone = "light" }) {
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(eventSlug);
  const [fields, setFields] = useState([]);
  const [event, setEvent] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [values, setValues] = useState({});
  const [video, setVideo] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const labelClass = tone === "dark" ? "text-white" : "text-gray-800";
  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-[#5B1D4D]";

  useEffect(() => {
    setSelectedSlug(eventSlug || "");
  }, [eventSlug]);

  useEffect(() => {
    let cancelled = false;
    fetchStates()
      .then((body) => {
        if (!cancelled) setStates(body.data || []);
      })
      .catch(() => {
        if (!cancelled) setStates([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedSlug) {
      setEvent(null);
      setFields([]);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setFormError("");
    setSuccess("");
    fetchForm(selectedSlug)
      .then((body) => {
        if (cancelled) return;
        setEvent(body.data.event);
        setFields(body.data.fields || []);
        setValues({});
        setVideo(null);
        setErrors({});
      })
      .catch((error) => {
        if (!cancelled) setFormError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSlug]);

  useEffect(() => {
    if (!values.state_id) {
      setCities([]);
      return undefined;
    }
    let cancelled = false;
    fetchCities(values.state_id)
      .then((body) => {
        if (!cancelled) setCities(body.data || []);
      })
      .catch(() => {
        if (!cancelled) setCities([]);
      });
    return () => {
      cancelled = true;
    };
  }, [values.state_id]);

  const orderedFields = useMemo(() => {
    return [...fields].sort((left, right) => {
      const leftRank = FIELD_RANK[left.fieldKey] ?? left.sortOrder ?? 50;
      const rightRank = FIELD_RANK[right.fieldKey] ?? right.sortOrder ?? 50;
      return leftRank - rightRank;
    });
  }, [fields]);

  const setValue = (key, value) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "state_id") next.city_id = "";
      if (key === "main_category") {
        next.other_category = "";
        next.sub_category = [];
        next.performing_arts_specify = "";
      }
      return next;
    });
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    orderedFields.forEach((field) => {
      if (!isVisible(field, values)) return;
      const value = values[field.fieldKey];
      const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);
      if (field.fieldKey === "audition_video") {
        if (field.isRequired && !video) nextErrors.audition_video = "Upload your audition video.";
        if (video && !video.type.startsWith("video/")) {
          nextErrors.audition_video = "Audition file must be a video.";
        }
        if (video && video.size > 100 * 1024 * 1024) {
          nextErrors.audition_video = "Audition video must be 100 MB or smaller.";
        }
        return;
      }
      if (field.fieldKey === "accepted_terms") {
        if (value !== "yes") nextErrors.accepted_terms = "Accept the Terms & Conditions to continue.";
        return;
      }
      if (field.isRequired && empty) nextErrors[field.fieldKey] = `${field.label} is required.`;
    });
    if (values.main_category === "other" && !String(values.other_category || "").trim()) {
      nextErrors.other_category = "Tell us the other category.";
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (values.mobile && !/^[0-9]{10}$/.test(values.mobile)) {
      nextErrors.mobile = "Enter a 10-digit mobile number.";
    }
    return nextErrors;
  };

  const handleSubmit = async (eventSubmit) => {
    eventSubmit.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !event) {
      setFormError("Check the highlighted fields.");
      return;
    }

    const answers = {};
    orderedFields.forEach((field) => {
      if (!isVisible(field, values) || field.fieldKey === "audition_video") return;
      const value = values[field.fieldKey];
      if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return;
      answers[field.fieldKey] = value;
    });

    const formData = new FormData();
    formData.append("eventId", String(event.id));
    formData.append("answers", JSON.stringify(answers));
    if (video) formData.append("auditionVideo", video);

    setLoading(true);
    setFormError("");
    try {
      const body = await submitRegistration(formData);
      setSuccess(body.message);
      setValues({});
      setVideo(null);
    } catch (error) {
      setErrors(error.fields || {});
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    if (!isVisible(field, values)) return null;
    const error = errors[field.fieldKey];
    const choices = field.options?.options || [];
    const commonLabel = (
      <span className={`mb-1 block text-sm font-medium ${labelClass}`}>
        {field.label}
        {field.isRequired ? <span className="text-red-400"> *</span> : null}
      </span>
    );

    let control = null;
    if (field.fieldKey === "state_id" || field.options?.dataSource === "states") {
      control = (
        <select
          className={inputClass}
          value={values.state_id || ""}
          onChange={(input) => setValue("state_id", input.target.value)}
        >
          <option value="">Select state</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      );
    } else if (field.fieldKey === "city_id" || field.options?.dataSource === "cities") {
      control = (
        <select
          className={inputClass}
          value={values.city_id || ""}
          disabled={!values.state_id}
          onChange={(input) => setValue("city_id", input.target.value)}
        >
          <option value="">{values.state_id ? "Select current city" : "Select a state first"}</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      );
    } else if (field.inputType === "radio") {
      control = (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {choices.map((choice) => (
            <label key={choice.value} className={`flex items-center gap-2 text-sm ${labelClass}`}>
              <input
                type="radio"
                name={field.fieldKey}
                checked={values[field.fieldKey] === choice.value}
                onChange={() => setValue(field.fieldKey, choice.value)}
              />
              {choice.label}
            </label>
          ))}
        </div>
      );
    } else if (field.inputType === "checkbox" && choices.length) {
      const selected = Array.isArray(values[field.fieldKey]) ? values[field.fieldKey] : [];
      control = (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {choices.map((choice) => (
            <label key={choice.value} className={`flex items-center gap-2 text-sm ${labelClass}`}>
              <input
                type="checkbox"
                checked={selected.includes(choice.value)}
                onChange={() => {
                  const next = selected.includes(choice.value)
                    ? selected.filter((item) => item !== choice.value)
                    : [...selected, choice.value];
                  setValue(field.fieldKey, next);
                }}
              />
              {choice.label}
            </label>
          ))}
        </div>
      );
    } else if (field.inputType === "checkbox") {
      control = (
        <label className={`flex items-start gap-2 text-sm ${labelClass}`}>
          <input
            type="checkbox"
            className="mt-1"
            checked={values[field.fieldKey] === "yes"}
            onChange={(input) => setValue(field.fieldKey, input.target.checked ? "yes" : "")}
          />
          <span>
            {field.label}{" "}
            <Link to="/terms" target="_blank" className="underline">
              Read the terms
            </Link>
          </span>
        </label>
      );
    } else if (field.inputType === "dropdown") {
      control = (
        <select
          className={inputClass}
          value={values[field.fieldKey] || ""}
          onChange={(input) => setValue(field.fieldKey, input.target.value)}
        >
          <option value="">Select</option>
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>{choice.label}</option>
          ))}
        </select>
      );
    } else if (field.fieldKey === "audition_video" || field.inputType === "file") {
      control = (
        <input
          className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-2 file:py-1`}
          type="file"
          accept="video/*"
          onChange={(input) => {
            setVideo(input.target.files?.[0] || null);
            setErrors((current) => ({ ...current, audition_video: "" }));
          }}
        />
      );
    } else if (field.inputType === "textarea") {
      control = (
        <textarea
          className={inputClass}
          rows={4}
          value={values[field.fieldKey] || ""}
          onChange={(input) => setValue(field.fieldKey, input.target.value)}
        />
      );
    } else {
      const type = field.inputType === "tel" ? "tel" : field.inputType || "text";
      control = (
        <input
          className={inputClass}
          type={type}
          value={values[field.fieldKey] || ""}
          maxLength={field.fieldKey === "mobile" ? 10 : undefined}
          onChange={(input) => setValue(field.fieldKey, input.target.value)}
        />
      );
    }

    return (
      <div key={field.id} className="mb-4">
        {field.inputType === "checkbox" && !choices.length ? null : commonLabel}
        {control}
        {field.fieldKey === "audition_video" ? (
          <p className={`mt-1 text-xs ${tone === "dark" ? "text-gray-300" : "text-gray-500"}`}>
            MP4, MOV, or WebM up to 100 MB.
            {video ? ` Selected: ${video.name}` : ""}
          </p>
        ) : null}
        {error ? <p className="mt-1 text-sm text-red-400">{error}</p> : null}
      </div>
    );
  };

  if (success) {
    return (
      <div className={`rounded-lg border border-green-300 bg-green-50 p-4 text-green-800`}>
        {success}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {!eventSlug ? (
        <label className="mb-4 block">
          <span className={`mb-1 block text-sm font-medium ${labelClass}`}>Event</span>
          <EventPicker
            selectedSlug={selectedSlug}
            onChange={setSelectedSlug}
            inputClass={inputClass}
            onEvents={setEvents}
            events={events}
          />
        </label>
      ) : null}

      {event ? (
        <p className={`mb-4 text-sm ${tone === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {event.registrationOpen
            ? `${event.name} · ${Number(event.price) > 0 ? `Fee ₹${event.price}` : "Registration is free"}`
            : `Registration for ${event.name} is closed.`}
        </p>
      ) : null}

      {formError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      {selectedSlug ? orderedFields.map(renderField) : (
        <p className={`mb-4 text-sm ${labelClass}`}>Choose an event to open its registration form.</p>
      )}

      {selectedSlug ? (
        <button className={buttonClass} type="submit" disabled={loading || event?.registrationOpen === false}>
          {loading ? "Submitting..." : "Submit registration"}
        </button>
      ) : null}
    </form>
  );
}

function EventPicker({ selectedSlug, onChange, inputClass, onEvents, events }) {
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchEvents()
      .then((body) => {
        if (cancelled) return;
        onEvents(body.data || []);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, [onEvents]);

  return (
    <>
      <select className={inputClass} value={selectedSlug} onChange={(input) => onChange(input.target.value)}>
        <option value="">Select an event</option>
        {events.map((item) => (
          <option key={item.id} value={item.slug}>{item.name}</option>
        ))}
      </select>
      {loadError ? <p className="mt-1 text-sm text-red-400">{loadError}</p> : null}
    </>
  );
}

export default RegistrationForm;
