import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageCarousel from '../../../components/carousal/ImageCarousel';
import FormInput from '../../../components/FormInput';
import {Button, TextInput} from '../../../ui-controls/index';
import eventsData from '../../../data/events.json';
import statesData from '../../../data/states.json';
import TopSection from '../components/TopSection';
import EventDetails from '../components/EventDetails';

const TalentHuntPage = () => {
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    talentCategory: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // In production, fetch from API
    const talentEvent = eventsData.events.find(e => e.slug === 'talent-hunt');
    setEvent(talentEvent || eventsData.events[0]);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register/talent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          state: '',
          talentCategory: '',
          description: '',
        });
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stateOptions = statesData.states.map((state) => ({
    value: state.name,
    label: state.name,
  }));

  const talentCategories = [
    'Singing',
    'Dancing',
    'Acting',
    'Music',
    'Art & Painting',
    'Photography',
    'Sports',
    'Writing',
    'Comedy',
    'Other',
  ];

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen bg-black overflow-auto custom-scrollbar">
      <TopSection event={event} />

      {/* Content and Form Section */}
      <EventDetails
        event={event}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        success={success}
        error={error}
        stateOptions={stateOptions}
        talentCategories={talentCategories}
      />
    </div>
  );
};

export default TalentHuntPage;

