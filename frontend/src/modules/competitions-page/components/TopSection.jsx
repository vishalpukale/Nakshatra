import React from 'react'
import { motion } from 'framer-motion';
import ImageCarousel from '../../../components/carousal/ImageCarousel';



const TopSection = ({ event }) => {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-black shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-txt-32 font-semibold text-white mb-4">
                            {event.name}
                        </h1>
                        <p className="text-txt-22.4px text-gray-400 max-w-3xl mx-auto">
                            {event.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Image Carousel */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ImageCarousel images={event.images} />
            </section>
        </div>
    )
}

export default TopSection