import React from "react";
import { Link } from "react-router";

export default function Home() {
  return (
    <section className="container mx-auto">
      {/* Home page title  */}
      <div className="flex justify-center items-center p-6">
        <h1 className="font-libre-baskerville text-2xl ">
          Welcome to Whispering Pages Admin panel
        </h1>
      </div>

      {/* Create Product button  */}
      <div className="flex items-center justify-center p-10">
        <Link to="/create-product">
          <button
            type="button"
            className="bg-black font-lato text-2xl text-white rounded-lg p-5"
          >
            Create Product
          </button>
        </Link>
      </div>
    </section>
  );
}
