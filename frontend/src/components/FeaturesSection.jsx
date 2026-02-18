import React from "react";
import {
    BookOpenIcon,
    UserGroupIcon,
    SparklesIcon,
    DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";

const features = [
    {
        icon: SparklesIcon,
        title: "AI-Powered Recommendations",
        desc: "Get personalized book suggestions based on your reading history and preferences.",
    },
    {
        icon: BookOpenIcon,
        title: "Extensive Library",
        desc: "Access a vast collection of books across all genres, from classics to modern bestsellers.",
    },
    {
        icon: UserGroupIcon,
        title: "Community Reviews",
        desc: "See what other readers are saying and join the discussion about your favorite stories.",
    },
    {
        icon: DevicePhoneMobileIcon,
        title: "Read Anywhere",
        desc: "Optimized for all devices so you can enjoy your reading journey on the go.",
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
                        Why Choose Us?
                    </h2>
                    <p className="text-gray-600 text-lg dark:text-gray-300">
                        Experience the best way to discover your next favorite book.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                        >
                            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6 dark:bg-gray-700">
                                <feature.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
