import React from 'react'
import { motion } from 'framer-motion';
import FormInput from '../../../components/FormInput';
import {Button, TextInput} from '../../../ui-controls/index';

const EventDetails = ({ event, formData, handleChange, handleSubmit, loading, success, error, stateOptions, talentCategories }) => {
  return (
    <div>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-txt-28 font-bold text-white mb-4">
                About This Event
              </h2>
              <p className="text-gray-300 text-txt-md-15 mb-6">
                {event.longDescription || event.description}
              </p>
            </div>

            {event.features && event.features.length > 0 && (
              <div>
                <h3 className="text-txt-22.4px font-semibold text-white mb-4">
                  What's Included
                </h3>
                <ul className="space-y-3 text-txt-md-15">
                  {event.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-gray-300 mr-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-primary-50 rounded-lg p-6">
              <div className="flex items-center mb-2">
                <svg
                  className="w-8 h-8 text-white mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-txt-28 font-semibold text-white">
                  Registration Fee: FREE
                </h3>
              </div>
              <p className="text-gray-300 text-txt-md-15">
                No registration fee required. Showcase your talent without any cost.
              </p>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black rounded-xl shadow-lg p-8"
          >
            <h2 className="text-txt-28 font-bold text-white mb-6">
              Register Now
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Registration successful! We'll contact you soon.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <TextInput 
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                labelClass={'text-white'}
              />

              <TextInput 
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                labelClass={'text-white'}
              />

              <TextInput 
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                labelClass={'text-white'}
              />

              <FormInput
                label="State"
                name="state"
                type="select"
                value={formData.state}
                onChange={handleChange}
                options={stateOptions}
                required
              />

              <FormInput
                label="Talent Category"
                name="talentCategory"
                type="select"
                value={formData.talentCategory}
                onChange={handleChange}
                options={talentCategories}
                required
              />

              <FormInput
                label="Tell us about your talent"
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your talent, experience, achievements, etc."
                required
              />

              <Button
                type="submit"
                name={loading ? 'Submitting...' : 'Submit Registration'}
                disabled={loading}
                className="w-full !bg-red"
                size="lg"
                btnStyle={'!text-white'}
              />
              
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EventDetails