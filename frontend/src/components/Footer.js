import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (

        <footer className="bg-black rounded-lg shadow m-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between bg-gray-800">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2024 CarbMine. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <Link to="/" className="hover:underline mr-4 md:mr-6">Home</Link>
                    </li>
                    <li>
                        <Link to="/calculation" className="hover:underline mr-4 md:mr-6">Calculations</Link>
                    </li>
                    <li>
                        <Link to="/estimate" className="hover:underline mr-4 md:mr-6">Estimate</Link>
                    </li>

                </ul>
            </div>
        </footer>

    )
}

export default Footer