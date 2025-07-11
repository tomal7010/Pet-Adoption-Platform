import React from 'react';
import bannerA from '../assets/bannerA.jpg';
import bannerB from '../assets/bannerB.jpg';
import bannerC from '../assets/bannerC.jpg';
import bannerD from '../assets/bannerD.jpg';
import Loving from '../assets/Loving.jpg';
import Cat from '../assets/Cat.jpg';
import dog from '../assets/dog.jpg';
import { Link } from 'react-router';
import { FaCat, FaDog, FaFish } from 'react-icons/fa';
import { GiRabbit } from 'react-icons/gi';
import { IoIosMore } from 'react-icons/io';


const categories = [
  { name: 'Cat', icon: <FaCat className="text-3xl" /> },
  { name: 'Dog', icon: <FaDog className="text-3xl" /> },
  { name: 'Rabbit', icon: <GiRabbit className="text-3xl" /> },
  { name: 'Fish', icon: <FaFish className="text-3xl" /> },
  
];

const Home = () => {
  return (
    <div className="font-sans">
      {/* Banner */}
            <div className="carousel w-full h-80">
                <div id="slide1" className="carousel-item relative w-full">
                    <img src={bannerA} className="w-full" alt="Slide 1" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide4" className="btn btn-circle">❮</a>
                        <a href="#slide2" className="btn btn-circle">❯</a>
                    </div>
                </div>

                <div id="slide2" className="carousel-item relative w-full">
                    <img src={bannerB} className="w-full" alt="Slide 2" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide1" className="btn btn-circle">❮</a>
                        <a href="#slide3" className="btn btn-circle">❯</a>
                    </div>
                </div>

                <div id="slide3" className="carousel-item relative w-full">
                    <img src={bannerC} className="w-full" alt="Slide 3" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide2" className="btn btn-circle">❮</a>
                        <a href="#slide4" className="btn btn-circle">❯</a>
                    </div>
                </div>

                <div id="slide4" className="carousel-item relative w-full">
                    <img src={bannerD} className="w-full" alt="Slide 4" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide3" className="btn btn-circle">❮</a>
                        <a href="#slide1" className="btn btn-circle">❯</a>
                    </div>
                </div>
            </div>

      {/* Browse by Category */}
      <section className="py-10 px-5 bg-white text-center">
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <div className="flex justify-center gap-10 flex-wrap">
          {categories.map((category, index) => (
            <Link to={`/category/${category.name.toLowerCase()}`} key={index}>
              <div className="flex flex-col items-center space-y-2 hover:scale-105 transition cursor-pointer">
                <div className="bg-green-100 p-4 rounded-full shadow-md">
                  {category.icon}
                </div>
                <span className="text-md font-medium">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-10 px-5 flex flex-col md:flex-row items-center gap-6">
        <img src= {Loving} alt="pet" className="w-full md:w-1/2 rounded-lg shadow-md" />
        <div>
          <h2 className="text-2xl font-bold mb-2">Give a Shelter Pet a Loving Home</h2>
          <p className="mb-4">Consider adopting a pet and make a difference in their lives.</p>
          <Link to="/auth/login">
            <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 cursor-pointer">Get Started</button>
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section className="py-10 px-5 text-center">
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <p className="max-w-xl mx-auto text-gray-700">
          We are dedicated to connecting loving families with pets in need of a home. Learn more about our adoption process and how you can help.
        </p>
      </section>

      {/* Extra Sections */}
      <section className="py-10 px-5 grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <img src={Cat} alt="Success" className="rounded-md w-full h-64 object-cover mb-4" />
          <h3 className="text-xl font-semibold mb-2">Success Stories</h3>
          <p className="max-w-2xl mx-auto text-gray-700 mb-6">
    Our goal is not only to shelter animals but also to find them a loving family. 
    Here you can read some inspiring stories where abandoned animals have found a new life.
  </p>
  <div className="max-w-2xl mx-auto text-left bg-gray-100 p-4 rounded-md shadow">
    <p className="italic">“We adopted Pusike one year ago. At first, he was very scared, but now he is the most beloved member of our family. He brings joy to our lives every day. We are grateful.”</p>
    <p className="mt-2 text-right font-semibold">– Hasan & Ruby</p>
  </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <img src= {dog} alt="Help" className="rounded-md w-full h-64 object-cover mb-4" />
          <h3 className="text-xl font-semibold mb-2">How You Can Help</h3>
          <p className="max-w-2xl mx-auto text-gray-700 mb-6">
    Every animal deserves a safe and loving home. You can join our mission — 
    by donating, volunteering, or becoming a foster family.
  </p>
  <ul className="list-disc list-inside text-left max-w-2xl mx-auto text-gray-800 space-y-2">
    <li>💝 <strong>Donate:</strong> Support food, medical care, and safe shelter for animals in our care.</li>
    <li>🤲 <strong>Volunteer:</strong> Give your time and love — together we can change lives.</li>
    <li>🏡 <strong>Foster:</strong> Provide temporary shelter until the animals find a permanent family.</li>
  </ul>
  <p className="mt-6 text-lg font-medium text-green-700">
    Your compassion can give an animal a new life — help now!
  </p>
        </div>
      </section>
    </div>
  );
};

export default Home;






