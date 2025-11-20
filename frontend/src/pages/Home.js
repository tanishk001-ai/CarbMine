import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  // Refs for hero elements
  const heroTextRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroImgBgRef = useRef(null);

  useEffect(() => {
    // Hero Section Animations on Page Load
    gsap.fromTo(
      '.reveal-hero-text',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.5, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.reveal-hero-img',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
    );

    gsap.fromTo(
      '#hero-img-bg',
      { scale: 0 },
      { scale: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' }
    );

    const sections = document.querySelectorAll('.reveal-up');

    sections.forEach(section => {
      const revealUptimeline = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: section,
          start: "10% 80%", // Animation starts when 10% of the section is within 80% of the viewport
          end: "20% 90%",   // Animation ends when 20% of the section is within 90% of the viewport
          // markers: true,  // Uncomment this line if you want to see the start and end markers
          // scrub: 1,       // Uncomment this line if you want to make the animation linked to scroll speed
          toggleActions: 'play none none reset', // Play the animation when it enters the viewport
        }
      });

      revealUptimeline.fromTo(section, {
        opacity: 0,
        y: 200, // Start from 100 pixels below its normal position
      }, {
        opacity: 1,
        y: "0%", // Animate to its normal position
        duration: 1.0, // Adjust duration for smoother animation
        stagger: 0.2,  // Apply a stagger effect if there are multiple '.reveal-up' elements inside the section
      });
    });


    // Cleanup ScrollTriggers on Unmount
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="flex min-h-[100vh] flex-col bg-[#fff]">
      {/* Hero Section */}
      <section className="relative flex min-h-[100vh] w-full max-w-[100vw] flex-col overflow-hidden mt-24">
        <div className="flex h-full min-h-[100vh] w-full place-content-center gap-6 p-[5%] max-xl:place-items-center max-lg:flex-col">
          <div className="flex flex-col place-content-center lg:mt-[-160px]">
            <div
              ref={heroTextRef}
              className="reveal-hero-text flex flex-wrap text-6xl font-semibold uppercase leading-[80px] max-lg:text-4xl max-md:leading-snug"
            >
              <span>Empowering India's</span>
              <br />
              <span>Coal Industry</span>
            </div>
            <div className="reveal-hero-text text-xl  text-slate-700 mt-2 max-w-[450px] p-2 pt-7 pb-7  max-lg:max-w-full">
              Our platform empowers mine operators to reduce carbon footprints, explore carbon-neutral strategies, calculate carbon credits, and lead the way to a sustainable future.
            </div>

            <div className="reveal-hero-text mt-4 flex place-items-center gap-4 overflow-hidden p-2 ">

              <Link to="/estimate" className="bg-[#00F020] text-white text-lg font-semibold py-3 px-6 rounded-lg transition-all hover:bg-green-600 hover:shadow-lg">
                Explore Carbon Solutions
              </Link>
              <Link to="/calculation" className="bg-white text-[#00F020] text-lg font-semibold py-3 px-6 rounded-lg transition-all hover:bg-green-600 border border-[#00F020] hover:shadow-lg">
                View
              </Link>
            </div>
          </div>
          <div className="flex w-full max-w-[50%] place-content-center place-items-center overflow-hidden max-lg:max-w-[unset]">
            <div className="flex h-[430px] w-[430px] max-h-[430px] max-w-[430px] overflow-hidden rounded-full max-lg:h-[320px] max-lg:w-[320px] lg:mt-[-150px]">
              <img
                ref={heroImgRef}
                src="./assets/s1.jfif"
                alt="app"
                className="reveal-hero-img z-[1] h-full w-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Features */}
      <section className='reveal-up lg:mt-[-30px]'>
        <h1 className='text-3xl font-bold text-center my-9'>Features</h1>
        <div className=" flex flex-wrap justify-center gap-6">

          {/* First Div */}
          <div className="w-full sm:w-1/2 lg:w-1/4 p-4 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-full w-44 h-44 flex items-center justify-center">
              <img
                src="assets/nemission.svg"
                alt="Placeholder"
                className="rounded-full w-28 h-28 object-cover"
              />
            </div>
            <h3 className="mt-4 text-center font-bold text-lg">Carbon Footprints</h3>
          </div>

          {/* Second Div */}
          <div className="w-full sm:w-1/2 lg:w-1/4 p-4 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-full w-44 h-44 flex items-center justify-center">
              <img
                src="assets/nneutral.svg"
                alt="Placeholder"
                className="rounded-full w-32 h-32 object-cover"
              />
            </div>
            <h3 className="mt-4 text-center font-bold text-lg">Carbon Neutralization</h3>
          </div>

          {/* Third Div */}
          <div className="w-full sm:w-1/2 lg:w-1/4 p-4 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-full w-44 h-44 flex items-center justify-center">
              <img
                src="assets/nvisual.svg"
                alt="Placeholder"
                className="rounded-full w-32 h-32 object-cover"
              />
            </div>
            <h3 className="mt-4 text-center font-bold text-lg">Data Visualization</h3>
          </div>

          {/* Fourth Div */}
          <div className="w-full sm:w-1/2 lg:w-1/4 p-4 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-full w-44 h-44 flex items-center justify-center">
              <img
                src="assets/ncredits.svg"
                alt="Placeholder"
                className="rounded-full w-24 h-24 object-cover"
              />
            </div>
            <h3 className="mt-4 text-center font-bold text-lg">Carbon Credits</h3>
          </div>

        </div>
      </section>


      {/* Footprint */}
      <section className="relative flex w-full max-w-[100vw] flex-col overflow-hidden p-6 lg:mt-32">
        <div className="reveal-up flex min-h-[60vh] place-content-center place-items-center gap-[10%] max-lg:flex-col max-lg:gap-10">

          <div className="flex">
            <div className="h-[1100px] w-[450px]">
              <img src="./assets/coal.jpg" alt="Coal Mine Emissions" className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="mt-6 flex max-w-[450px] flex-col gap-4">
            <h3 className="text-4xl font-medium">Coal Mine Carbon Emission Estimation</h3>

            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Excavation Impact
              </h4>
              <span className="text-xl">
                Measure carbon emissions produced from coal excavation processes, including the use of heavy machinery and energy-intensive operations.
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Transportation Emissions
              </h4>
              <span className="text-xl">
                Calculate the emissions from transporting coal, including vehicle fuel consumption and distances traveled between sites.
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Workforce Contribution
              </h4>
              <span className="text-xl">
                Factor in the number of workers and their activities, including the energy used for worker transportation and facilities.
              </span>
            </div>
          </div>
        </div>
      </section>



      {/* Carbon Neutralization */}
      <section className="relative flex w-full max-w-[100vw] flex-col overflow-hidden p-6 lg:mt-10">
        <div className="reveal-up flex min-h-[60vh] place-content-center place-items-center gap-[10%] max-lg:flex-col max-lg:gap-10">
          <div className="mt-6 flex max-w-[450px] flex-col gap-4">
            <h3 className="text-4xl font-medium">Carbon Neutralization Solutions</h3>

            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Afforestation Initiatives
              </h4>
              <span className="text-xl">
                We suggest calculating the amount of land required for afforestation to effectively capture CO₂ and enhance carbon sequestration.
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Electric Vehicle (EV) Adoption
              </h4>
              <span className="text-xl">
                Transition your fleet to EVs to reduce emissions from conventional fuel sources.
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Green Fuel Solutions
              </h4>
              <span className="text-xl">
                Shift to green fuels to lower emissions and support sustainable energy use.
              </span>
            </div>
          </div>

          <div className="flex">
            <div className="h-[450px] w-[300px]">
              <img src="./assets/neutral.webp" alt="Carbon Neutralization" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </section>


      {/* Carbon Credits Calculation */}
      <section className="relative flex w-full max-w-[100vw] flex-col overflow-hidden p-6 lg:mt-10">
        <div className="reveal-up flex min-h-[60vh] place-content-center place-items-center gap-[10%] max-lg:flex-col max-lg:gap-10">
          <div className="flex">
            <div className="h-[450px] w-[300px]">
              <img src="./assets/carbcredits.webp" alt="Carbon Credits" className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="mt-6 flex max-w-[450px] flex-col gap-4">
            <h3 className="text-4xl font-medium">Carbon Credits</h3>

            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Carbon Credits Estimation
              </h4>
              <span className="text-xl">
                Our system calculates the number of carbon credits you can generate based on Neutralization solutions.
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-xl font-medium">
                <i className="bi bi-check-all !text-2xl"></i>
                Pricing Information
              </h4>
              <span className="text-xl">
                We provide an estimated market value for the generated carbon credits, helping you understand the financial benefits of your sustainability efforts.
              </span>
            </div>
          </div>
        </div>
      </section>

      <hr className='text-white min-w-screen'></hr>
      <div className='bg-gray-800'>
        <Footer />
      </div>
    </div>
  );
}

export default Home;